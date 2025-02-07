import React, { useState } from "react";
import axios from "axios";

function ImageUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [error, setError] = useState("");

  // When the user selects a file, update the state
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError("");
    }
  };

  // When the form is submitted, send the file to the backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a file first.");
      return;
    }

    // Create a FormData object and append the file under the key "file"
    const formData = new FormData();
    formData.append("file", selectedFile);
    console.log(selectedFile)
    try {
      // Post the FormData to the FastAPI endpoint.
      // Adjust the URL (here "http://localhost:8000/upload_image") to match your backend.
      const response = await axios.post("http://localhost:8000/upload_image", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      setResponseData(response.data);
      console.log(response.data)
    } catch (err) {
      setError("Error uploading the image.");
      console.error(err);
    }
  };

  return (
    <div style={{ margin: "20px" }}>
      <h1>Upload an Image</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: "10px" }}>
          Upload
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {responseData && (
        <div style={{ marginTop: "20px" }}>
          <h2>Processed Image Data</h2>
          <p>
            <strong>Derived Hex Code:</strong> {responseData.derived_hex_code}
          </p>
          <p>
            <strong>Monk Hex:</strong> {responseData.monk_hex}
          </p>
          <p>
            <strong>Monk Skin Tone:</strong> {responseData.monk_skin_tone}
          </p>
          <p>
            <strong>Dominant RGB:</strong> {responseData.dominant_rgb.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}

export default ImageUploader;
