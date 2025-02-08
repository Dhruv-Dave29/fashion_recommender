import React, { useState } from "react";
import { Client } from "@gradio/client";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file input changes.
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // This function sends the image file to the Gradio endpoint.
  const handlePredict = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    
    try {
      // In our case, the file object is already a Blob.
      const imageBlob = file;
      
      // Connect to your Gradio model repository (update the repo id if needed).
      const client = await Client.connect("davelop/face_skin_color");
      
      // Call the predict endpoint.
      // Note: We're sending the image as binary using the "data" parameter.
      const prediction = await client.predict("/predict", { image_path: imageBlob });
      
      // The API is expected to return an object with keys like
      // "derived_hex_code", "monk_hex", "monk_skin_tone", and "dominant_rgb"
      setResult(prediction.data);
      console.log(prediction.data)
    } catch (error) {
      console.error("Prediction error:", error);
      setResult({ error: "An error occurred during prediction." });
    }
    
    setLoading(false);
  };

  return (
    <div style={{ padding: "1rem" }}>
      <h1>Face Skin Color Detection</h1>
      <p>Select an image file (or use your device's camera on mobile) to get the skin color analysis.</p>
      <input
        type="file"
        accept="image/*"
        capture="environment" // This hints mobile devices to use the camera.
        onChange={handleFileChange}
      />
      <br />
      <button onClick={handlePredict} disabled={loading || !file} style={{ marginTop: "1rem" }}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {result && (
        <div style={{ marginTop: "2rem" }}>
          <h2>Prediction Result</h2>
          {result.error ? (
            <p style={{ color: "red" }}>{result.error}</p>
          ) : (
            <div>
              <p>
                <strong>Monk Skin Tone:</strong> {result.monk_skin_tone}
              </p>
              <p>
                <strong>Monk Hex:</strong> {result.monk_hex}
              </p>
              <p>
                <strong>Derived Hex Code:</strong> {result.derived_hex_code}
              </p>
              <p>
                <strong>Dominant RGB:</strong> {JSON.stringify(result.dominant_rgb)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
