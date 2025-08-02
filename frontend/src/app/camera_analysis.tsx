"use client";

import React, { useRef, useState, useEffect } from "react";
import Webcam from "react-webcam";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import FoodWasteAPI, { AnalysisResult } from "./lib/api";

export default function CameraAnalysis() {
  const webcamRef = useRef<Webcam>(null);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string | null>(null);

  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 463, height: 240 });

  // mount cameras
  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
      } catch (error) {
        console.error("Error fetching cameras:", error);
      }
    };
    fetchCameras();
  }, []);

  const handleCameraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCamera(e.target.value);
  };

  // Adjust webcam size
  const adjustWebcamSize = (newWidth: number) => {
    setDimensions({
      width: newWidth,
      height: Math.round(newWidth * (240 / 320)),
    });
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  // Capture and analyze with enhanced API
  const captureAndAnalyze = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const base64 = imageSrc.split(",")[1];
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const { id, role } = userData;
      const data = await FoodWasteAPI.analyzeImage({
        image: base64,
        user_id: id,
        role: role || "guest", // Default to 'guest' if no role is set
        password: "1234",
      });
      setResult(data);

    } catch (err) {
      console.error(err);
      setResult({
        class_name: "Unknown",
        confidence_score: 0,
        instruction: "Failed to analyze image.",
        error: "Failed to analyze image.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto my-12 bg-white border border-gray-200 shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl font-bold text-gray-900"
        >
          Camera Analysis
        </motion.h2>
        <p className="text-sm text-gray-700">
          Capture and analyze images from your webcam in real-time.
        </p>

        {cameras.length > 0 && (
          <div className="flex flex-col">
            <label className="text-sm text-gray-700 mb-1">Select Camera:</label>
            <select
              className="border border-gray-300 rounded px-2 py-1"
              value={selectedCamera || ""}
              onChange={handleCameraChange}
            >
              {cameras.map((camera, index) => (
                <option key={camera.deviceId} value={camera.deviceId}>
                  {camera.label || `Camera ${index + 1}`}
                </option>
              ))}
            </select>
          </div>
        )}


        <div className="flex justify-center">
          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            width={dimensions.width}
            height={dimensions.height}
            className="rounded-lg border border-gray-200 shadow-sm"
          />
        </div>

        <Button
          onClick={captureAndAnalyze}
          disabled={loading}
          size="lg"
          className="bg-green-700 hover:bg-green-800 text-white"
        >
          {loading ? "Analyzing..." : "Capture & Analyze"}
        </Button>

        {result && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 p-4 bg-green-50 rounded-lg"
          >
            {result.error ? (
              <p className="text-red-600">{result.error}</p>
            ) : (
              <>
                {/* Basic Analysis Results */}
                <div className="space-y-2">
                  <p className="text-gray-900">
                    <strong>Class:</strong> {result.class_name}
                  </p>
                  <p className="text-gray-900">
                    <strong>Confidence:</strong> {result.confidence_score}%
                  </p>
                  <p className="text-gray-900">
                    <strong>Instruction:</strong> {result.instruction}
                  </p>
                  {result.image_path && (
                    <p className="text-gray-600 italic">
                      Saved image to local storage.
                    </p>
                  )}
                </div>

                {/* USDA Nutritional Data */}
                {result.usdaData && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Nutritional Information
                    </h4>
                    <p className="text-sm text-gray-700 mb-2">
                      {result.usdaData.description}
                    </p>
                    {result.usdaData.nutrients &&
                      result.usdaData.nutrients.length > 0 && (
                        <div className="space-y-1">
                          {result.usdaData.nutrients
                            .slice(0, 5)
                            .map((nutrient, index) => (
                              <p key={index} className="text-sm text-gray-600">
                                {nutrient.name}: {nutrient.amount}{" "}
                                {nutrient.unitName}
                              </p>
                            ))}
                        </div>
                      )}
                  </div>
                )}

                {/* Environmental Impact */}
                {result.wasteImpact && (
                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Environmental Impact
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600">Carbon Footprint:</p>
                        <p className="font-medium">
                          {result.wasteImpact.carbonFootprint} kg CO2
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Water Usage:</p>
                        <p className="font-medium">
                          {result.wasteImpact.waterUsage} liters
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Cost Estimate:</p>
                        <p className="font-medium">
                          ${result.wasteImpact.costEstimate.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">Compostable:</p>
                        <p className="font-medium">
                          {result.wasteImpact.compostingPotential
                            ? "Yes"
                            : "No"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1">
            <label className="text-sm text-gray-700">
              Width: <span className="font-medium">{dimensions.width}px</span>
            </label>
            <input
              type="range"
              name="width"
              min={160}
              max={463}
              value={dimensions.width}
              onChange={handleSliderChange}
              className="w-full mt-1"
            />
          </div>
          <Button variant="outline" onClick={() => adjustWebcamSize(463)}>
            Reset Size
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
