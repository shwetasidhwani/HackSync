import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import moment from "moment";

const MLCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventTitle, setEventTitle] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get("/api/calendar/events");
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    const eventForDate = events.find(
      (event) => moment(event.date).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD")
    );
    setEventTitle(eventForDate ? eventForDate.title : "");
  };

  const handleAddOrEditEvent = async () => {
    if (!eventTitle.trim()) return;

    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const existingEvent = events.find((event) => moment(event.date).format("YYYY-MM-DD") === formattedDate);

    if (existingEvent) {
      // Edit event
      await axios.put(`/api/calendar/events/${existingEvent._id}`, { title: eventTitle, date: formattedDate });
      setEvents(events.map((event) => (event._id === existingEvent._id ? { ...event, title: eventTitle } : event)));
    } else {
      // Add new event
      const response = await axios.post("/api/calendar/events", { title: eventTitle, date: formattedDate });
      setEvents([...events, response.data]);
    }

    setEventTitle("");
  };

  const handleDeleteEvent = async () => {
    const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
    const existingEvent = events.find((event) => moment(event.date).format("YYYY-MM-DD") === formattedDate);

    if (existingEvent) {
      await axios.delete(`/api/calendar/events/${existingEvent._id}`);
      setEvents(events.filter((event) => event._id !== existingEvent._id));
      setEventTitle("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto", textAlign: "center" }}>
      <h2>Agentic ML Calendar</h2>
      <Calendar onChange={handleDateClick} value={selectedDate} />
      <div style={{ marginTop: "20px" }}>
        <input
          type="text"
          placeholder="Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
        />
        <button onClick={handleAddOrEditEvent}>Save Event</button>
        <button onClick={handleDeleteEvent} style={{ background: "red", color: "white" }}>
          Delete Event
        </button>
      </div>
    </div>
  );
};

export default MLCalendar;
