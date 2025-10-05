import React, { useEffect, useRef } from 'react';
import { X, Download, QrCode } from 'lucide-react';
import QRCode from 'qrcode';
import { Crop } from '../types';

interface QRCodeModalProps {
  crop: Crop;
  onClose: () => void;
}

const QRCodeModal: React.FC<QRCodeModalProps> = ({ crop, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      // Simple QR code with just crop ID
      QRCode.toCanvas(
        canvasRef.current,
        crop.id, // Just the crop ID for simplicity
        {
          width: 300,
          margin: 2,
          color: {
            dark: '#EA580C', // Orange-600
            light: '#FFFFFF'
          }
        }
      );
    }
  }, [crop]);

  const handleDownload = () => {
    if (canvasRef.current) {
      const link = document.createElement('a');
      link.download = `${crop.name}-qr-code.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <QrCode className="h-6 w-6 text-orange-600" />
            <h2 className="text-xl font-bold text-gray-800">QR Code for {crop.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            title="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div className="bg-orange-50 p-6 rounded-lg mb-4">
            <canvas ref={canvasRef} className="mx-auto" />
          </div>
          
          <div className="text-sm text-gray-600 mb-4">
            <p className="font-semibold mb-2">Crop Information:</p>
            <div className="text-left space-y-1">
              <p><strong>Name:</strong> {crop.name}</p>
              <p><strong>Type:</strong> {crop.crop_type}</p>
              <p><strong>Harvest Date:</strong> {new Date(crop.harvest_date).toLocaleDateString()}</p>
              <p><strong>Expiry Date:</strong> {new Date(crop.expiry_date).toLocaleDateString()}</p>
              <p><strong>Expiry Date:</strong> {new Date(crop.expiry_date).toLocaleDateString()}</p>
              <p><strong>Soil Type:</strong> {crop.soil_type}</p>
              <p><strong>Pesticides:</strong> {crop.pesticides_used || 'None'}</p>
            </div>
          </div>

          <div className="flex space-x-3 justify-center">
            <button
              onClick={handleDownload}
              className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              <span>Download QR Code</span>
            </button>
            <button
              onClick={onClose}
              className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <X className="h-4 w-4" />
              <span>Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeModal;