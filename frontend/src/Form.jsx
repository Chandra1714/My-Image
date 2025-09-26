import React, { useEffect, useState, Suspense } from "react";

const Lottie = React.lazy(() => import("lottie-react"));
const MotionDiv = React.lazy(() =>
  import("framer-motion").then((mod) => ({ default: mod.motion.div }))
);

import deliveryAnimation from "./assets/Delivery Truck _ Loading _ Exporting (1).json";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const Form = () => {
  const [fileinput, setfileinput] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [newlyUploaded, setNewlyUploaded] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("selectedImages"));
    if (saved) setSelectedImages(saved);
  }, []);

  const onChangeHandle = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.size <= 1024 * 1024);
    if (validFiles.length !== files.length) {
      alert("Some files were larger than 1MB and were skipped!");
    }
    setfileinput(validFiles);
  };

  const handleImage = async (e) => {
    e.preventDefault();
    if (fileinput.length === 0) return;

    try {
      const formData = new FormData();
      fileinput.forEach((file) => formData.append("image", file));

      const response = await fetch(`${API_URL}/api/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error(`Upload failed: ${response.status}`);

      const data = await response.json();
      const newImages = data.uploaded.map((img) => img.url);

      setNewlyUploaded(newImages);
      setIsAnimating(true);

      setfileinput([]);
      document.getElementById("fileInput").value = "";
    } catch (err) {
      console.error("Error uploading images:", err);
    }
  };

  const handleAnimationComplete = () => {
    const allImages = [...selectedImages, ...newlyUploaded];
    setSelectedImages(allImages);
    localStorage.setItem("selectedImages", JSON.stringify(allImages));
    setNewlyUploaded([]);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden bg-gray-900 text-white">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse"></div>
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 rounded-full mix-blend-screen filter blur-[120px] opacity-50 animate-pulse"></div>


      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <Suspense key={i} fallback={null}>
            <MotionDiv
              className="absolute w-2 h-2 rounded-full bg-white/40 shadow-lg"
              initial={{ x: Math.random() * 1200, y: Math.random() * 800, opacity: 0 }}
              animate={{
                y: [Math.random() * 800, Math.random() * -200],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          </Suspense>
        ))}
      </div>

      <form
        onSubmit={handleImage}
        className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] 
               p-10 flex flex-col items-center gap-6 w-full max-w-md z-10
                hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] transition-all duration-500"
      >
        <h2 className="text-3xl font-extrabold text-white drop-shadow-md tracking-wide">
          Upload Your Image
        </h2>

        <input
          id="fileInput"
          type="file"
          accept="image/*"
          multiple
          onChange={onChangeHandle}
          className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 
                 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-pink-500 file:to-purple-600 
                 file:text-white hover:file:scale-105 hover:file:from-pink-600 hover:file:to-purple-700
                 transition-transform cursor-pointer text-gray-300"
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-cyan-400 to-blue-600 text-white font-bold px-8 py-3 rounded-full shadow-lg
                 hover:scale-110 hover:shadow-[0_0_25px_rgba(0,200,255,0.6)] transition-transform duration-300"
        >
          Upload Image(s)
        </button>
      </form>

      {isAnimating && (
        <div className="mt-12 z-10 flex flex-col items-center">
          <Suspense fallback={<p className="text-gray-400">Loading animation...</p>}>
            <MotionDiv
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="p-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-xl"
            >
              <Lottie
                animationData={deliveryAnimation}
                loop={false}
                className="w-72 h-72"
                onComplete={handleAnimationComplete}
              />
            </MotionDiv>
          </Suspense>
          <p className="text-gray-200 font-semibold text-center mt-4">
            Delivering your image...
          </p>
        </div>
      )}

      {selectedImages.length > 0 && !isAnimating && (
        <div className="mt-12 w-full max-w-5xl z-10">
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            Uploaded Images
          </h3>
          <div className="flex flex-wrap gap-8 justify-center">
            {selectedImages.map((img, index) => (
              <Suspense key={index} fallback={null}>
                <MotionDiv
                  initial={{ scale: 0.5, rotateY: 90, opacity: 0 }}
                  animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="w-56 h-56 bg-white/10 backdrop-blur-md border border-white/20 
                       rounded-2xl overflow-hidden shadow-xl hover:scale-110 hover:rotate-3
                       hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] transition-all duration-500"
                >
                  <img
                    src={img}
                    alt={`Uploaded ${index}`}
                    className="w-full h-full object-cover"
                  />
                </MotionDiv>
              </Suspense>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
