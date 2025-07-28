'use client'

import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

export default function CameraAnalysis() {
  const webcamRef = useRef<Webcam>(null);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 640, height: 240 });

  // Adjust webcam size
  const adjustWebcamSize = (newWidth: number) => {
    setDimensions({ width: newWidth, height: Math.round(newWidth * (240 / 320)) });
  };

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDimensions(prev => ({ ...prev, [name]: parseInt(value, 10) }));
  };

  // Capture and analyze
  const captureAndAnalyze = async () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const base64 = imageSrc.split(',')[1];
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, user_id: 1, role: 'guest', password: '1234' }),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: 'Failed to analyze image.' });
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
            {loading ? 'Analyzing...' : 'Capture & Analyze'}
          </Button>

          {result && (
              <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 space-y-2 p-4 bg-green-50 rounded-lg"
              >
                {result.error ? (
                    <p className="text-red-600">{result.error}</p>
                ) : (
                    <>
                      <p className="text-gray-900"><strong>Class:</strong> {result.class_name}</p>
                      <p className="text-gray-900"><strong>Confidence:</strong> {result.confidence_score}%</p>
                      <p className="text-gray-900"><strong>Instruction:</strong> {result.instruction}</p>
                      {result.image_path && (
                          <p className="text-gray-600 italic">Saved image to local storage.</p>
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
                  max={1280}
                  value={dimensions.width}
                  onChange={handleSliderChange}
                  className="w-full mt-1"
              />
            </div>
            <Button variant="outline" onClick={() => adjustWebcamSize(640)}>
              Reset Size
            </Button>
          </div>
        </CardContent>
      </Card>
  );
}
