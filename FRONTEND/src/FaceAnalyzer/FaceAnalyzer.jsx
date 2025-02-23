import React, { useRef, useState, useEffect } from 'react';

function FaceAnalyzer() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error('Error accessing camera:', error);
      });
  }, []);

  const captureAndAnalyze = async () => {
    setLoading(true);
    try {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL('image/jpeg').split(',')[1]; // Base64

      const response = await fetch(
        "https://www.wolframcloud.com/obj/bfe45f6b-b175-4945-9fdc-4ca057bbf528",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: imageData })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get response from Wolfram");
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        setAnalysisResult(data);
      } catch {
        try {
          const decoded = atob(text);
          setAnalysisResult(decoded);
        } catch {
          setAnalysisResult(text);
        }
      }
    } catch (err) {
      console.error('Error analyzing face:', err);
      setAnalysisResult("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Face Analyzer</h2>
      <div style={{ marginBottom: '20px' }}>
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{
            width: '100%',
            maxWidth: '640px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
      
      <button 
        onClick={captureAndAnalyze}
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4299e1',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '16px'
        }}
      >
        {loading ? "Analyzing..." : "Analyze Face"}
      </button>

      {analysisResult && (
        <div style={{ 
          marginTop: '20px',
          padding: '20px',
          backgroundColor: '#f7fafc',
          borderRadius: '8px',
          textAlign: 'left',
          maxWidth: '640px',
          margin: '20px auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          <pre>
            {typeof analysisResult === 'object' 
              ? JSON.stringify(analysisResult, null, 2) 
              : analysisResult}
          </pre>
        </div>
      )}
    </div>
  );
}

export default FaceAnalyzer;