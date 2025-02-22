import React, { useState } from "react";

const FacialEmotions = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [emotionResult, setEmotionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("img", selectedFile); // Attach image file

    setLoading(true);
    setError(null);
    setEmotionResult(null);

    try {
      const response = await fetch(
        "https://www.wolframcloud.com/obj/819ff8c1-8de5-4ce0-891b-ac6678a417bb",
        {
          method: "POST",
          body: formData,
        }
      );

      console.log(response)

      const rawText = await response.text(); // Get raw response before parsing
      console.log("RAW RESPONSE:", rawText);

      try {
        const data = JSON.parse(rawText); // Attempt to parse JSON
        if (data.Success === false) {
          throw new Error(data.Failure || "Emotion detection failed.");
        }
        setEmotionResult(data);
      } catch (jsonError) {
        throw new Error("Invalid JSON from API: " + rawText);
      }
    } catch (err) {
      console.error("Upload Error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  //     setLoading(true);
  //     setError(null);
  //     setEmotionResult(null);

  //     try {
  //       const response = await fetch(
  //         "https://www.wolframcloud.com/obj/c3a91969-f672-4240-9263-b996d6c837b9",
  //         {
  //           method: "POST",
  //           body: formData,
  //         }
  //       );

  //       const data = await response.json();

  //       if (data.Success === false) {
  //         throw new Error(data.Failure || "Emotion detection failed.");
  //       }

  //       setEmotionResult(data);
  //     } catch (err) {
  //       setError(err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Upload an Image for Emotion Detection</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Processing..." : "Detect Emotion"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {emotionResult && (
        <div>
          <h3>Detected Emotion:</h3>
          <pre>{JSON.stringify(emotionResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default FacialEmotions;
