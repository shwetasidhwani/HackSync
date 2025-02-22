import React, { useState } from 'react';
import axios from 'axios';
import './CognitiveLoadPredictor.css';

const CognitiveLoadPredictor = () => {
  const [formData, setFormData] = useState({
    duration: '30',
    engagement_level: '3',
    event_type: 'meeting',
    location: 'office',
    time_of_day: 'morning'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log(formData);
    try {
      const response = await axios.post('http://127.0.0.1:5000/cogPredict', formData);
      setPrediction(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while making the prediction');
    }
    setLoading(false);
  };

  return (
    <div className="predictor-container">
      <div className="predictor-card">
        <h2>Cognitive Load Predictor</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              required
              min="1"
              max="480"
            />
          </div>

          <div className="form-group">
            <label>Engagement Level (1-10)</label>
            <input
              type="number"
              name="engagement_level"
              value={formData.engagement_level}
              onChange={handleInputChange}
              required
              min="1"
              max="10"
            />
          </div>

          <div className="form-group">
            <label>Event Type</label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleInputChange}
            >
              <option value="meeting">meeting</option>
              <option value="exercise">Exercise</option>
              <option value="break">break</option>
              <option value="social_interaction">Social Interaction</option>
              <option value="commute">Commute</option>
              <option value="casual_lunch">Casual Lunch</option>
            </select>
          </div>

          <div className="form-group">
            <label>Location</label>
            <select
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            >
              <option value="office">office</option>
              <option value="home">home</option>
              <option value="gym">Gym</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div className="form-group">
            <label>Time of Day</label>
            <select
              name="time_of_day"
              value={formData.time_of_day}
              onChange={handleInputChange}
            >
              <option value="morning">morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>

          <button type="submit" className="predict-button" disabled={loading}>
            {loading ? 'Predicting...' : 'Predict Behavior using Deep Learning'}
          </button>
        </form>

        {prediction && (
          <div className="prediction-results">
            <h3>Analysis Results</h3>
            <div className="result-card">
              <div className="probability-indicator" 
                   style={{
                     backgroundColor: prediction.risk_level === 'High' ? '#ff4d4d' : 
                                    prediction.risk_level === 'Medium' ? '#ffd700' : '#4CAF50'
                   }}>
                {/* <span className="probability">
                  {(prediction.overload_probability * 100).toFixed(1)}%
                </span> */}
                <span className="risk-level">
                Overloaded : {prediction.is_overloaded}
                </span>
              </div>


              {/* <div className="analysis-section">
                <h4>Contributing Factors:</h4>
                <ul>
                  {prediction.contributing_factors.map((factor, index) => (
                    <li key={index}>{factor}</li>
                  ))}
                </ul>
              </div>

              <div className="analysis-section">
                <h4>Recommendations:</h4>
                <ul>
                  {prediction.recommendations.map((rec, index) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CognitiveLoadPredictor;