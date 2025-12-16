
import React, { useState } from "react";

const RemoveBackground = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 1. Handle File Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create a preview URL so the user can see what they selected
      setPreviewUrl(URL.createObjectURL(file));
      setProcessedImage(null); // Reset previous result
      setError("");
    }
  };

  // 2. Convert File to Base64 & Send to Backend
  const handleRemoveBackground = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");

    // Helper to convert file to Base64 string
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    try {
      // Convert file
      const base64Image = await toBase64(selectedFile);

      // Send to backend
      const response = await fetch("http://localhost:5000/api/remove-background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl: base64Image }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      // Set the result
      setProcessedImage(data.resultUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to process image. Please try a simpler image (JPG/PNG).");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Background Remover</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
        
        {/* Input Section */}
        <div className="mb-8 text-center">
          <label className="block mb-4 text-lg font-medium text-gray-700">
            Upload an image to remove its background
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100
              cursor-pointer"
          />
        </div>

        {/* Action Button */}
        {selectedFile && (
          <div className="text-center mb-8">
            <button
              onClick={handleRemoveBackground}
              disabled={loading}
              className={`px-8 py-3 rounded-lg text-white font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl"
              }`}
            >
              {loading ? "Processing... (This takes a moment)" : "Remove Background ✨"}
            </button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Results Area - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Original */}
          {previewUrl && (
            <div className="text-center">
              <h3 className="font-semibold text-gray-500 mb-2">Original</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-gray-50 h-64 flex items-center justify-center overflow-hidden">
                <img 
                  src={previewUrl} 
                  alt="Original" 
                  className="max-h-full max-w-full object-contain" 
                />
              </div>
            </div>
          )}

          {/* Result */}
          {processedImage && (
            <div className="text-center">
              <h3 className="font-semibold text-green-600 mb-2">Background Removed!</h3>
              <div 
                className="border-2 border-green-200 rounded-lg p-2 h-64 flex items-center justify-center overflow-hidden relative"
                // Checkerboard pattern for transparency
                style={{
                  backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), 
                                    linear-gradient(-45deg, #ccc 25%, transparent 25%), 
                                    linear-gradient(45deg, transparent 75%, #ccc 75%), 
                                    linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                  backgroundSize: "20px 20px",
                  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
                }}
              >
                <img 
                  src={processedImage} 
                  alt="Processed" 
                  className="max-h-full max-w-full object-contain z-10 relative" 
                />
              </div>
              <a 
                href={processedImage} 
                download="removed-bg.png" 
                className="inline-block mt-4 text-sm text-blue-600 hover:underline"
              >
                Download Image
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;