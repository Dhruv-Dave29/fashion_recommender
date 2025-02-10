import React, { useRef, useState } from 'react';
import { Camera, Upload } from 'lucide-react';
import Button from './Button';

interface ImageCaptureProps {
  onImageCapture: (image: string) => void;
}

const Modal: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
}> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

const ImageCapture: React.FC<ImageCaptureProps> = ({ onImageCapture }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" } // Prefer front camera on mobile devices
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsModalOpen(true);
        setShowCamera(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      let errorMessage = 'Unable to access camera. ';
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          errorMessage += 'Please grant camera permissions in your browser settings.';
        } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
          errorMessage += 'No camera device found.';
        } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
          errorMessage += 'Camera is in use by another application.';
        } else {
          errorMessage += 'Please ensure your device has a working camera and try again.';
        }
      }
      
      setCameraError(errorMessage);
      setShowCamera(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setShowCamera(false);
    setIsModalOpen(false);
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageDataUrl = canvas.toDataURL('image/jpeg');
        setSelectedImage(imageDataUrl);
        setIsAnalyzing(true);
        stopCamera();
        
        // Simulate analysis (replace with your actual analysis logic)
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsAnalyzing(false);
        
        onImageCapture(imageDataUrl);
      }
    }
  };

  const handleVideoPlay = () => {
    console.log('Video stream started');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = e.target?.result as string;
        setSelectedImage(image);
        onImageCapture(image);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {selectedImage ? (
        <div className="relative">
          <img
            src={selectedImage}
            alt="Captured"
            className="w-full rounded-lg shadow-lg"
          />
          <Button
            variant="outline"
            onClick={() => setSelectedImage(null)}
            className="absolute top-2 right-2"
          >
            Retake
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {cameraError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600">{cameraError}</p>
              <p className="text-sm text-red-500 mt-2">
                Try using the upload option instead, or check your browser settings.
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="primary"
              icon={Camera}
              onClick={startCamera}
              className="w-full"
            >
              Use Camera
            </Button>
            <Button
              variant="outline"
              icon={Upload}
              onClick={handleUploadClick}
              className="w-full"
            >
              Upload Photo
            </Button>
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={stopCamera}>
        <div className="space-y-4">
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="w-full h-full border-2 border-dashed border-white opacity-50"></div>
            </div>
          </div>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" onClick={capturePhoto}>
              Take Photo
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>

      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg">Analyzing image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageCapture;