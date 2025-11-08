import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../ImageUploader/ImageUploader.css";
import toast from "react-hot-toast";
// import Settings from "../Settings/Settings";

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [quizStartTime, setQuizStartTime] = useState(null); // New state for start time
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setIsUploaded(false);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        toast.success(`File uploaded successfully: ${data.fileName}`);
        setIsUploaded(true);
      } else {
        toast.error("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("An error occurred while uploading the file");
    }
  };

  const handleStartQuiz = () => {
    setQuizStartTime(new Date()); // Set quiz start time
    navigate("/question", { state: { quizStartTime: new Date() } }); // Pass start time to Question component
  };

  return (
    <>
      <div className="image">
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} disabled={!file}>
          Upload to Google Drive
        </button>
      </div>
      {isUploaded && (
        <div className="box">
          <p>
            Dynamic Questions Generated from (src_type-pdf/image). Number of
            Questions Ready: 5. Time: 2 mins (increase/decrease)
            <br />
            <span>Advance - Category: Polity</span>
          </p>
          {/* <Settings/> */}
          <button className="start" onClick={handleStartQuiz}>
            Start Quiz
          </button>
        </div>
      )}
    </>
  );
};

export default ImageUploader;
