import Webcam from "react-webcam";
import { useRef, useState } from "react";

function CameraAnalysis() {
  const webcamRef = useRef<Webcam>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const captureAndAnalyze = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log("imageSrc:", imageSrc);
      if (!imageSrc) {
        console.log("No image captured from webcam.");
        return;
      }

      // Remove the data:image/jpeg;base64, prefix
      const base64 = imageSrc.split(",")[1];
      console.log("base64 length:", base64.length);

      setLoading(true);
      try {
        console.log("Sending request to backend...");
        const response = await fetch("http://localhost:5000/analyze", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64,
            user_id: 1, // Replace with actual user_id if needed
            role: "guest", // Or "admin" or "user"
            password: "1234",
          }),
        });
        console.log("Response status:", response.status);
        const data = await response.json();
        console.log("Response data:", data);
        setResult(data);
      } catch (error) {
        console.error("Error during fetch or JSON parsing:", error);
        setResult({ error: "Failed to analyze image." });
      }
      setLoading(false);
    } else {
      console.log("webcamRef.current is null");
    }
  };

  return (
    <div>
      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={320}
        height={240}
      />
      <div>
        <button onClick={captureAndAnalyze} disabled={loading}>
          {loading ? "Analyzing..." : "Capture & Analyze"}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: 16 }}>
          {result.error ? (
            <div style={{ color: "red" }}>{result.error}</div>
          ) : (
            <div>
              <div>
                <b>Class:</b> {result.class_name}
              </div>
              <div>
                <b>Confidence:</b> {result.confidence_score}%
              </div>
              <div>
                <b>Instruction:</b> {result.instruction}
              </div>
              {result.image_path && (
                <div>
                  <b>Saved Image Path:</b> {result.image_path}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default CameraAnalysis;
