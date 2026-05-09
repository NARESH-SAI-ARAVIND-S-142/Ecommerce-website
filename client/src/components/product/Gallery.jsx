import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Gallery = ({ images = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const currentImage = images[currentIndex]?.url || 'https://via.placeholder.com/600x800?text=No+Image';

  const handleMouseMove = (e) => {
    if (!isZoomed) return;
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4 h-full">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:w-24 flex-shrink-0">
        {images.map((img, idx) => (
          <button
            key={img.publicId || idx}
            onClick={() => setCurrentIndex(idx)}
            className={`relative w-20 h-24 md:w-full md:h-32 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
              idx === currentIndex ? 'border-violet shadow-glow' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div
        className="relative flex-1 bg-white/5 rounded-2xl overflow-hidden cursor-crosshair h-[400px] md:h-[600px]"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            src={currentImage}
            alt="Product detail"
            className="w-full h-full object-cover"
            style={{
              transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
              transform: isZoomed ? 'scale(2.5)' : 'scale(1)',
            }}
          />
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Gallery;
