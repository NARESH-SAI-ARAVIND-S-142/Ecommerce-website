import { useState } from 'react';
import { HiOutlineUpload, HiOutlineX, HiOutlineClipboardCopy } from 'react-icons/hi';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import Button from '../common/Button';

const ImageUploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadedUrl('');
  };

  const handleUpload = async () => {
    if (!file) return toast.error('Please select an image to upload');

    const formData = new FormData();
    formData.append('images', file); // Field name matches backend uploadProductImage.array('images')

    setUploading(true);
    try {
      const { data } = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setUploadedUrl(data.images[0].url);
      toast.success('Image uploaded successfully to Cloudinary!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(uploadedUrl);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass-strong rounded-2xl w-full max-w-md p-6 relative border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <HiOutlineX size={24} />
        </button>

        <h2 className="text-xl font-heading font-bold text-white mb-6 flex items-center gap-2">
          <HiOutlineUpload className="text-violet" /> Upload Image
        </h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Select Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet/10 file:text-violet
                hover:file:bg-violet/20 transition-all cursor-pointer"
            />
          </div>

          <Button
            variant="primary"
            fullWidth
            onClick={handleUpload}
            loading={uploading}
            disabled={!file || uploading}
          >
            Upload to Cloudinary
          </Button>

          {uploadedUrl && (
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-green-400 mb-2 font-medium">Upload Successful!</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={uploadedUrl}
                  className="flex-1 bg-navy border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-300 focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-gray-300 transition-colors"
                  title="Copy URL"
                >
                  <HiOutlineClipboardCopy size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadModal;
