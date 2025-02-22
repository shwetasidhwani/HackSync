import React, { useState } from "react";
import axios from "axios";

const moods = [
  { label: "Overworked", color: "bg-red-400" },
  { label: "Distressed", color: "bg-yellow-400" },
  { label: "Burned Out", color: "bg-orange-400" }
];

export default function ChatApp() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true); 

    try {
      const response = await axios.post("http://127.0.0.1:5000/chat", {
        message: input,
        mood: selectedMood
      });
      console.log(response.data.response);
      setMessages([...messages, userMessage, { role: "ai", content: response.data.response }]);
    } catch (error) {
      console.error("Error fetching response", error);
    }
    setLoading(false);
  };

  if (!selectedMood) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-yellow-300 to-orange-400">
        <h2 className="text-2xl font-semibold text-white mb-6">How are you feeling today?</h2>
        <div className="flex gap-4">
          {moods.map((mood) => (
            <button
              key={mood.label}
              className={`p-4 w-40 h-24 text-lg font-semibold text-white rounded-lg shadow-md transition-transform transform hover:scale-105 ${mood.color}`}
              onClick={() => setSelectedMood(mood.label)}
            >
              {mood.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-yellow-50">
      <div className="bg-orange-500 text-white text-xl p-4 font-semibold text-center">AI Counselor - {selectedMood} Mode</div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 max-w-xs rounded-lg shadow-md ${msg.role === "user" ? "bg-blue-500 text-white self-end" : "bg-gray-200 text-gray-800 self-start"}`}
          >
            {msg.content}
          </div>
        ))}
        {loading && <div className="text-gray-500">AI is thinking...</div>}
      </div>
      <div className="p-4 flex">
        <input
          type="text"
          className="flex-1 p-3 border rounded-lg shadow-sm"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className="ml-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg shadow-md"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}
