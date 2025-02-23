import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import moment from "moment";

const MLCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState("");
  const [eventStart, setEventStart] = useState(new Date());
  const [eventEnd, setEventEnd] = useState(new Date());
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchEvents();
  }, []);

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: "", type: "" }), 3000);
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/calendar/events");
      setEvents(response.data);
    } catch (error) {
      showAlert("Failed to fetch events", "error");
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventForDate = events.find(
      (event) => moment(event.start).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
    );

    if (eventForDate) {
      setEventTitle(eventForDate.title);
      setEventStart(new Date(eventForDate.start));
      setEventEnd(new Date(eventForDate.end));
    } else {
      setEventTitle("");
      setEventStart(date);
      setEventEnd(date);
    }
  };

  const handleAddOrEditEvent = async () => {
    if (!eventTitle.trim()) {
      showAlert("Please enter an event title", "error");
      return;
    }

    const formattedStart = moment(eventStart).toISOString();
    const formattedEnd = moment(eventEnd).toISOString();

    const existingEvent = events.find(
      (event) => moment(event.start).format("YYYY-MM-DD") === moment(selectedDate).format("YYYY-MM-DD")
    );

    try {
      if (existingEvent) {
        // Edit event
        const response = await axios.put(
          `http://localhost:3000/api/calendar/events/${existingEvent._id}`,
          { title: eventTitle, start: formattedStart, end: formattedEnd }
        );

        setEvents(events.map((event) =>
          event._id === existingEvent._id ? response.data : event
        ));
        showAlert("Event updated successfully", "success");
      } else {
        // Add event
        const response = await axios.post("http://localhost:3000/api/calendar/events", {
          title: eventTitle,
          start: formattedStart,
          end: formattedEnd,
        });

        setEvents([...events, response.data]);
        showAlert("Event added successfully", "success");
      }

      setEventTitle("");
    } catch (error) {
      showAlert("Failed to save event", "error");
    }
  };

  const handleDeleteEvent = async () => {
    const existingEvent = events.find(
      (event) => moment(event.start).format("YYYY-MM-DD") === moment(selectedDate).format("YYYY-MM-DD")
    );

    if (!existingEvent) {
      showAlert("No event found to delete", "error");
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/api/calendar/events/${existingEvent._id}`);
      setEvents(events.filter((event) => event._id !== existingEvent._id));
      setEventTitle("");
      showAlert("Event deleted successfully", "success");
    } catch (error) {
      showAlert("Failed to delete event", "error");
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-center items-center p-6">
      {/* Left Section: Calendar */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Agentic ML Calendar</h2>
        <Calendar
          onChange={handleDateClick}
          value={selectedDate}
          tileClassName={({ date }) =>
            events.some((event) =>
              moment(event.start).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
            )
              ? "bg-blue-500 text-white rounded-full"
              : ""
          }
          className="w-full border rounded-lg shadow"
        />
      </div>

      {/* Right Section: Event Form */}
      <div className="mt-6 md:mt-0 md:ml-6 w-full md:w-96 bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Manage Event</h3>

        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid grid-cols-2 gap-4 my-4">
          <input
            type="datetime-local"
            value={moment(eventStart).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setEventStart(new Date(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            value={moment(eventEnd).format("YYYY-MM-DDTHH:mm")}
            onChange={(e) => setEventEnd(new Date(e.target.value))}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-center gap-4">
          <button
            onClick={handleAddOrEditEvent}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Save Event
          </button>
          <button
            onClick={handleDeleteEvent}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Event
          </button>
        </div>

        {alert.show && (
          <div
            className={`mt-4 p-3 rounded text-center ${
              alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {alert.message}
          </div>
        )}
      </div>

      {/* Bottom Section: Event List */}
      <div className="mt-6 bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Upcoming Events</h3>
        <div className="space-y-2">
          {events.map((event) => (
            <div
              key={event._id}
              className="p-3 border rounded hover:bg-gray-50 cursor-pointer"
              onClick={() => handleDateClick(new Date(event.start))}
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-gray-600">
                {moment(event.start).format("MMM D, YYYY h:mm A")} -{" "}
                {moment(event.end).format("MMM D, YYYY h:mm A")}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MLCalendar;
