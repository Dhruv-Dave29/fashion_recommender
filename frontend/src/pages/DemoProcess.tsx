import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageCapture from '../components/ImageCapture';
import { Camera, Shield, Sparkles, Sun } from 'lucide-react';
import { Client } from "@gradio/client";

// Add interface at the top of the file
interface SkinAnalysisResult {
  monk_skin_tone: string;
  monk_hex: string;
  derived_hex_code: string;
  dominant_rgb: number[];
}

const DemoProcess = () => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [skinAnalysisResult, setSkinAnalysisResult] = useState<SkinAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const analyzeSkinColor = async (imageBlob: Blob) => {
    try {
      // Connect to Gradio model repository
      const client = await Client.connect("davelop/face_skin_color");
      
      // Call the predict endpoint
      const prediction = await client.predict("/predict", { 
        image_path: imageBlob 
      });
      
      setSkinAnalysisResult(prediction.data as SkinAnalysisResult);
      console.log("Skin analysis result:", prediction.data);
      
      // Store the result in sessionStorage for use in other components
      sessionStorage.setItem('skinAnalysis', JSON.stringify(prediction.data));
      
      // Continue with navigation after analysis
      navigate('/demo/try-on');
    } catch (error) {
      console.error("Skin analysis error:", error);
      // Handle error appropriately
      setCameraError("Failed to analyze skin color. Please try again.");
    }
  };

  const handleImageCapture = async (image: string) => {
    setIsProcessing(true);
    setIsAnalyzing(true);

    try {
      // Store the captured image in sessionStorage
      sessionStorage.setItem('capturedImage', image);
      
      // Convert base64 image to blob
      const response = await fetch(image);
      const blob = await response.blob();
      
      // Analyze skin color
      await analyzeSkinColor(blob);
    } catch (error) {
      console.error("Image processing error:", error);
      setCameraError("Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
      setIsAnalyzing(false);
    }
  };

  const features = [
    {
      icon: <Camera className="w-8 h-8 text-purple-500" />,
      title: "Easy Capture",
      description: "Take or upload a photo in seconds"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-500" />,
      title: "Secure Process",
      description: "Your photos are processed securely"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "AI-Powered",
      description: "Advanced AI for accurate results"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Virtual Try-On Experience
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get ready to see yourself in a whole new way. Take a photo or upload one to begin your personalized try-on experience.
            </p>
          </div>

          {/* Main Content */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
            <div className="mb-8">
              {cameraError && (
                <div className="text-red-500 text-center mb-4">
                  {cameraError}
                </div>
              )}
              {isProcessing ? (
                <div className="text-center p-12">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="mt-4 text-lg text-gray-600">Processing your image...</p>
                  <p className="text-sm text-gray-500">This will only take a moment</p>
                </div>
              ) : (
                <ImageCapture onImageCapture={handleImageCapture} />
              )}
            </div>

            {/* Tips Section */}
            <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Sun className="w-6 h-6 text-purple-500 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Tips for the Perfect Shot
                </h3>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Ensure your face is well-lit</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Remove glasses or accessories</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Face the camera directly</span>
                </li>
                <li className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                  <span>Keep a neutral expression</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300"
              >
                <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {isAnalyzing && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
              <div className="bg-white rounded-lg p-6 text-center max-w-md w-full mx-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-lg text-gray-900 font-medium mb-2">Analyzing image...</p>
                <p className="text-sm text-gray-600">We're detecting your skin tone and features</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default DemoProcess;