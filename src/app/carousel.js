import { useEffect, useState } from "react";

const images = [
  "/partner/image-1.png",
  "/partner/image-2.png",
  "/partner/image-3.png",
  "/partner/image-4.png",
];

export default function ImageCarousel() {
  const [isIphone, setIsIphone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && /iPhone|iPod/.test(navigator.userAgent)) {
      setIsIphone(true);
    }
  }, []);

  const tripledImages = [...images, ...images, ...images]; // утраиваем для лучшего эффекта

  return (
    <div className="relative overflow-hidden py-4">
      <div className="flex gap-4 animate-scroll">
        {tripledImages.map((src, idx) => (
          <img
            key={idx}
            src={src}
            alt={`carousel-img-${idx}`}
            className={`rounded-lg object-cover ${
              isIphone ? "h-24 w-24" : "h-40 w-40"
            }`}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(66.67%);
          }
        }

        .animate-scroll {
          animation: scroll 15s linear infinite;
        }
      `}</style>
    </div>
  );
}
