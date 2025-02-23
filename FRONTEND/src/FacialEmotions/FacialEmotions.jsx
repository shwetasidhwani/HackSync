import React, { useState } from "react";

const FacialEmotions = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://www.wolframcloud.com/obj/03cd0d25-906f-40e2-80c1-f238763e20fc",
        {
          method: "GET",
        }
      );
      console.log(response)
      if (!response.ok) {
        throw new Error("Failed to get response from Wolfram");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Wolfram Analysis</h2>
      <button 
        onClick={handleAnalyze} 
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: "#4299e1",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontSize: "16px"
        }}
      >
        {loading ? "Processing..." : "Analyze"}
      </button>

      {result && (
        <div style={{ 
          marginTop: "20px", 
          padding: "20px", 
          backgroundColor: "#f7fafc",
          borderRadius: "8px",
          textAlign: "left" 
        }}>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FacialEmotions;
