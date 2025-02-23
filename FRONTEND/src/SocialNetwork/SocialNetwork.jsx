// src/UserForm.jsx
import React, { useState } from "react";
import './SocialNetwork.css';

const SocialNetwork = () => {
  const [formData, setFormData] = useState({
    age: "21",
    gender: "Female",
    time_spent: "",
    platform: "Instagram",
    interests: "Sports",
    location: "Australia",
    demographics: "Urban",
    profession: "Student",
    income: "10000",
    indebt: false,
    isHomeOwner: false,
    Owns_Car: false,
  });

  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData)
    try {
      const response = await fetch("http://127.0.0.1:5000/getUserGroup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log(response.data)
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="social-network-container">
      <div className="form-card">
        <h1>Social Network Analysis</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Age:</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Gender:</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
            <div className="form-group">
              <label>Average Time Spent on Socials:</label>
              <input
                type="number"
                name="time_spent"
                value={formData.time_spent}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Platform:</label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
              </select>
            </div>
            <div className="form-group">
              <label>Interests:</label>
              <select
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Sports">Sports</option>
                <option value="Travel">Travel</option>
                <option value="Lifestyle">Lifestyle</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location:</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Australia">Australia</option>
                <option value="United States">United States</option>
              </select>
            </div>
            <div className="form-group">
              <label>Demographics:</label>
              <select
                name="demographics"
                value={formData.demographics}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Urban">Urban</option>
                <option value="Sub_Urban">Sub_Urban</option>
                <option value="Rural">Rural</option>
              </select>
            </div>
            <div className="form-group">
              <label>Profession:</label>
              <select
                name="profession"
                value={formData.profession}
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Student">Student</option>
                <option value="Marketer Manager">Marketer Manager</option>
              </select>
            </div>
            <div className="form-group">
              <label>Income:</label>
              <input
                type="number"
                name="income"
                value={formData.income}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="checkbox-grid">
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="indebt"
                  checked={formData.indebt}
                  onChange={handleChange}
                />
                In Debt
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="isHomeOwner"
                  checked={formData.isHomeOwner}
                  onChange={handleChange}
                />
                Is Home Owner
              </label>
            </div>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="Owns_Car"
                  checked={formData.Owns_Car}
                  onChange={handleChange}
                />
                Owns Car
              </label>
            </div>
          </div>

          <button type="submit" className="submit-btn">Analyze Profile</button>
        </form>
      </div>

      {result && (
        <div className="result-card">
          <h2>User Group: <span className="highlight">Group {result.group}</span></h2>
          <div className="result-section">
            <h3>Similar Users</h3>
            <ul className="result-list">
              {result.names.map((name, index) => (
                <li key={index}>{name}</li>
              ))}
            </ul>
          </div>
          <div className="result-section">
            <h3>Similarities</h3>
            <ul className="result-list">
              {result.similarities.map((similarity, index) => (
                <li key={index}>{similarity}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default SocialNetwork;
