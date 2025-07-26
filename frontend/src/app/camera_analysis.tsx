import Webcam from "react-webcam";
import { useRef, useState, useEffect } from "react";
import styles from './camera_analysis.module.css';

// CameraAnalysis component for capturing and analyzing images from webcam
function CameraAnalysis() {
  const webcamRef = useRef<Webcam>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 640, height: 240 });

  

  // Adjusting Webcam size by setting width (will automatically adjust height to maintain aspect ratio)
  const adjustWebcamSize = (newWidth: number) =>{
    setDimensions({ width: newWidth, height: Math.round(newWidth * (240 / 320)) });
  }
 
  // Handle slider changes to update webcam dimensions
  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const { name, value } = event.target;
    setDimensions((prev) => ({
      ...prev,
      [name]: parseInt(value, 10)
    }));
  };

  // Capture image from webcam and send it to backend for analysis
  const captureAndAnalyze = async () => {
    
    
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      console.log("imageSrc:", imageSrc);
      if (!imageSrc) {
        console.log("No image captured from webcam.");
        return;
      }

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
          // Sending base64 image data along with user info
          body: JSON.stringify({
            image: base64,
            user_id: 1,
            role: "guest",
            password: "1234",
          }),
        });
        // Check if the response is ok
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

  // Render the webcam and controls
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Camera Analysis</h1>
      <p className={styles.description}>
        Capture and analyze images from your webcam in real-time.
      </p>

      <Webcam
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={dimensions.width}
        height={dimensions.height}
        className={styles.webcam}
      />
      <div>
        <button 
          onClick={captureAndAnalyze} 
          disabled={loading}
          className={styles.capture_button}>
          {loading ? "Analyzing..." : "Capture & Analyze"}
        </button>
      </div>
      {result && (
        <div style={{ marginTop: 16 }}>
          {result.error ? (
            <div style={{ color: "red" }} className={styles.error_message}>{result.error}</div>
          ) : (
            <div className={styles.result_container}>
              <div className={styles.class_name}>
                <b>Class:</b> {result.class_name}
              </div>
              <div className={styles.confidence_score}>
                <b>Confidence:</b> {result.confidence_score}%
              </div>
              <div className={styles.instruction}>
                <b>Instruction:</b> {result.instruction}
              </div>
              {result.image_path && (
                <div className={styles.saved_image}>
                  Saved Image Path in Local Storage!
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className={styles.dimensions_controls}>
        <label className={styles.width_label}>
          Width: <span>{dimensions.width}px</span>
          <input className={styles.width_input}
            type="range"
            name="width"
            min="160"
            max="1280"
            value={dimensions.width}
            onChange={handleSliderChange}
          />
        </label>

        <button className={styles.reset_button} onClick={() => adjustWebcamSize(640)}>Reset Size</button>
      </div>
    </div>
  );
}

export default CameraAnalysis;
