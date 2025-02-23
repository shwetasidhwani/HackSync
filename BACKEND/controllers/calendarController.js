const CalendarEvent = require("../models/calendarModel");

// Get all events
exports.getEvents = async (req, res) => {
  try {
    const events = await CalendarEvent.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching events" });
  }
};

// Add a new event
exports.addEvent = async (req, res) => {
  try {
    console.log(req.body);
    const { title, start, end } = req.body;
    const newEvent = new CalendarEvent({ title, start, end });
    await newEvent.save();
    res.status(200).json(newEvent);
    console.log("New event saved!");    
  } catch (error) {
    res.status(500).json({ error: "Error creating event" });
  }
};

// Update an event
exports.editEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start, end } = req.body;
    const updatedEvent = await CalendarEvent.findByIdAndUpdate(
      id,
      { title, start, end },
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: "Error updating event" });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    await CalendarEvent.findByIdAndDelete(id);
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting event" });
  }
};
