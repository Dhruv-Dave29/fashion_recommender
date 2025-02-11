import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import ImageCapture from '../components/ImageCapture';
import { Camera, Shield, Sun, Image, ArrowRight } from 'lucide-react';
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
      icon: <Camera className="w-10 h-10 text-purple-500" />,
      title: "Quick Capture",
      description: "Take a selfie or upload a photo in seconds"
    },
    {
      icon: <Image className="w-10 h-10 text-purple-500" />,
      title: "AI Analysis",
      description: "Advanced skin tone detection technology"
    },
    {
      icon: <ArrowRight className="w-10 h-10 text-purple-500" />,
      title: "Instant Results",
      description: "Get personalized recommendations immediately"
    }
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-4 py-12">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Discover Your Perfect <span className="text-purple-600">Color Palette</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience personalized beauty recommendations powered by AI. Start by taking a photo or uploading one.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="bg-white rounded-3xl shadow-xl p-8 order-2 md:order-1">
              {cameraError && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  {cameraError}
                </div>
              )}
              
              {isProcessing ? (
                <div className="text-center py-16">
                  <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent"></div>
                  <p className="mt-6 text-lg text-gray-600 font-medium">Processing your image...</p>
                  <p className="text-gray-500">This will only take a moment</p>
                </div>
              ) : (
                <ImageCapture onImageCapture={handleImageCapture} />
              )}
            </div>

            <div className="space-y-8 order-1 md:order-2">
              <div className="bg-purple-50 rounded-3xl p-8">
                <div className="flex items-center mb-6">
                  <Sun className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="text-2xl font-semibold text-gray-900">
                    Tips for Best Results
                  </h3>
                </div>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <span className="w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3"></span>
                    <p className="text-gray-700">Ensure good lighting on your face</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3"></span>
                    <p className="text-gray-700">Remove glasses and accessories</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3"></span>
                    <p className="text-gray-700">Face the camera directly</p>
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 mt-2 bg-purple-500 rounded-full mr-3"></span>
                    <p className="text-gray-700">Maintain a neutral expression</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="bg-purple-50 w-20 h-20 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Overlay */}
        {isAnalyzing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full mx-4 shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-6"></div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Analyzing your image</h3>
              <p className="text-gray-600">Our AI is detecting your unique skin tone and features</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DemoProcess;