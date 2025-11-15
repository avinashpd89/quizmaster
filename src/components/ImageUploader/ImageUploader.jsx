import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ImageUploader() {
  const [uploadType, setUploadType] = useState("paragraph");
  const [paragraph, setParagraph] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // ============================
  // 🚀 Upload Handler
  // ============================
  const handleUpload = async () => {
    setIsLoading(true);

    // Artificial 3 sec delay
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // -------- Paragraph Upload --------
    if (uploadType === "paragraph") {
      if (!paragraph.trim()) {
        setIsLoading(false);
        return toast.error("Paragraph is empty");
      }

      try {
        const response = await fetch("/api/upload-paragraph", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ paragraph }),
        });

        const data = await response.json();

        if (!response.ok) {
          setIsLoading(false);
          return toast.error(data.message);
        }

        toast.success("Paragraph uploaded & saved to DB!");

        // Clear input
        setParagraph("");
        setIsUploaded(true);
      } catch (error) {
        toast.error("Server error!");
      }

      setIsLoading(false);
      return;
    }

    // -------- URL Upload --------
    if (uploadType === "url") {
      if (!url.trim()) {
        setIsLoading(false);
        return toast.error("URL is empty");
      }

      try {
        const response = await fetch("/api/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        const data = await response.json();

        if (!response.ok) {
          setIsLoading(false);
          return toast.error(data.message);
        }

        toast.success("URL uploaded & saved to DB!");

        // Clear input
        setUrl("");
        setIsUploaded(true);
      } catch (error) {
        toast.error("Server error!");
      }

      setIsLoading(false);
      return;
    }

    // -------- Image Upload --------
    if (uploadType === "image") {
      if (!file) {
        setIsLoading(false);
        return toast.error("Please select an image");
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setIsLoading(false);
          return toast.error(data.message);
        }

        toast.success(`Image uploaded: ${data.fileName}`);

        // Clear input
        setFile(null);
        setIsUploaded(true);
      } catch (error) {
        toast.error("Upload failed!");
      }

      setIsLoading(false);
    }
  };

  const handleStartQuiz = () => {
    navigate("/question", { state: { quizStartTime: new Date() } });
  };

  return (
    <div className="w-full flex flex-col items-center p-6 space-y-6">

      <h2 className="text-2xl font-semibold text-gray-300">
        Select Upload Method
      </h2>

      {/* Upload type */}
      <div className="flex space-x-6">
        {["paragraph", "url", "image"].map((type) => (
          <label key={type} className="flex items-center space-x-2">
            <input
              type="radio"
              name="uploadType"
              value={type}
              checked={uploadType === type}
              onChange={() => setUploadType(type)}
            />
            <span className="capitalize">{type}</span>
          </label>
        ))}
      </div>

      {/* Input Section */}
      <div className="w-full max-w-lg bg-white shadow-md rounded-xl p-6 space-y-4">

        {uploadType === "paragraph" && (
          <textarea
            className="w-full border rounded-lg p-3 h-32 focus:ring focus:ring-blue-300"
            placeholder="Enter paragraph text here..."
            value={paragraph}
            onChange={(e) => setParagraph(e.target.value)}
          />
        )}

        {uploadType === "url" && (
          <input
            type="text"
            className="w-full border rounded-lg p-3 focus:ring focus:ring-blue-300"
            placeholder="Enter website URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        )}

        {uploadType === "image" && (
          <input
            type="file"
            className="w-full bg-gray-100 rounded-lg p-3"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={isLoading}
          className={`w-full text-white py-2 rounded-lg transition ${
            isLoading ? "bg-gray-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="loader border-2 border-white border-t-transparent rounded-full w-5 h-5 animate-spin"></span>
              <span>Uploading...</span>
            </div>
          ) : (
            uploadType === "image" ? "Upload Image" : "Upload"
          )}
        </button>
      </div>

      {/* After Upload Box */}
      {isUploaded && !isLoading && (
        <div className="bg-green-100 p-5 rounded-xl shadow-md w-full max-w-lg text-center">
          <p className="text-gray-700">
            <strong>Dynamic Questions Generated!</strong><br />
            Number of Questions: 5 — Time: 2 mins<br />
            Category: <span className="text-blue-700 font-semibold">Polity</span>
          </p>

          <button
            className="mt-4 bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-lg"
            onClick={handleStartQuiz}
          >
            Start Quiz
          </button>
        </div>
      )}
    </div>
  );
}
