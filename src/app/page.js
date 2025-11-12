"use client";
import TinderCard from "react-tinder-card";
import { useState, useRef, useMemo, createRef, useEffect } from "react";
import { useWindowSize } from "react-use";
// import Confetti from "react-confetti";
import { fbPractica } from "./styles/fonts";
import { getOrCreateAnonymousToken } from "../../lib/anonymous-token";
import OnboardingTour from "../components/OnboardingTour";
import "../components/OnboardingTour.css";

// iOS detection to tweak visuals specifically for Safari/iOS rendering quirks
const isIosUserAgent = () => {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || navigator.vendor || (typeof window !== "undefined" && window.opera) || "";
  const isIphoneIpadIpod = /iPad|iPhone|iPod/.test(ua);
  const isIpadOsSafari = /Mac/.test(ua) && typeof navigator.maxTouchPoints === "number" && navigator.maxTouchPoints > 1;
  return isIphoneIpadIpod || isIpadOsSafari;
};

// Компонент фейерверков
const Fireworks = ({ show, width, height }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (!show) {
      setParticles([]);
      return;
    }

    const newParticles = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3', '#54a0ff'];
    
    // Создаём несколько фейерверков
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height * 0.6; // В верхней части экрана
      
      // Создаём частицы для каждого фейерверка
      for (let j = 0; j < 20; j++) {
        const angle = (Math.PI * 2 * j) / 20;
        const velocity = 2 + Math.random() * 3;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        newParticles.push({
          id: `${i}-${j}`,
          x: x,
          y: y,
          vx: vx,
          vy: vy,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 60 + Math.random() * 40, // Время жизни частицы
          size: 3 + Math.random() * 4
        });
      }
    }
    
    setParticles(newParticles);
  }, [show, width, height]);

  useEffect(() => {
    if (!show || particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles(prev => 
        prev.map(particle => ({
          ...particle,
          x: particle.x + particle.vx,
          y: particle.y + particle.vy,
          vy: particle.vy + 0.1, // Гравитация
          life: particle.life - 1
        })).filter(particle => particle.life > 0)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [show, particles.length]);

  if (!show) return null;

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 999 }}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.life / 100,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
    </div>
  );
};

// Shuffle function to randomize array order
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const db = [
  {
    url: "./partner2/7.png",
    prize: "./partner/7.png",
    coupon: "COUPONCODE",
    topText: "גופיית רטרו ADIDAS",
    cardText: "גופיית רטרו עונת 80/81 אדידס",
    productUrl: "https://shop.maccabi.co.il/product/adidas-retro-jersey/",
    upStashTable: 'ADIDAS 2025-26',
    oldPrice: 350,
    newPrice: 245,
    discount: 30
  },
  {
    url: "./partner2/6.png",
    prize: "./partner/6.png",
    coupon: "COUPONCODE",
    topText: "ג'קט ZNE ADIDAS  לבן נשים",
    cardText: "ג'קט ללא כובע גזרת נשים בצבע לבן עם הכיתוב 'MACCABI' בעיצוב כוכבים.",
    productUrl: "https://shop.maccabi.co.il/product/adidas-jacketzne-white-w/",
    upStashTable: 'ADIDAS 2025-26',
    oldPrice: 350,
    newPrice: 245,
    discount: 30
  },
  {
    url: "./partner2/5.png",
    prize: "./partner/5.png",
    coupon: "COUPONCODE",
    topText: "סווטשירט ZNE ADIDAS שחור בוגרים ",
    cardText: "סווטשירט ללא כובע לבוגרים בצבע שחור עם הכיתוב 'MACCABI BASKETBALL'",
    productUrl: "https://shop.maccabi.co.il/product/adidas-sweatshirtzne-black/",
    upStashTable: 'ADIDAS 2025-26',
    oldPrice: 400,
    newPrice: 280,
    discount: 30
  },
  {
    url: "./partner2/4.png",
    prize: "./partner/4.png",
    coupon: "COUPONCODE",
    topText: "ג'קט ZNE ADIDAS אפור ילדים",
    cardText: "ג'קט עם רוכסן לילדים בצבע אפור עם לוגו הקבוצה.",
    productUrl: "https://shop.maccabi.co.il/product/adidas-kids-jacketzne-grey/",
    upStashTable: 'ADIDAS 2025-26',
    oldPrice: 350,
    newPrice: 245,
    discount: 30
  },
  {
    url: "./partner2/1.png",
    prize: "./partner/1.png",
    coupon: "COUPONCODE",
    topText: "קפוצ'ון ADIDAS כותנה כחול אפרפר בוגרים",
    cardText: "קפוצ'ון מכותנה לבוגרים בצבע כחול אפרפר.",
    productUrl: "https://shop.maccabi.co.il/product/adidas-hoodie-bluegrey/",
    upStashTable: 'ADIDAS 2025-26',
    oldPrice: 320,
    newPrice: 225,
    discount: 30
  },
  {
    url: "./partner2/2.png",
    prize: "./partner/2.png",
    coupon: "COUPONCODE",
    topText: "ג'קט ADIDAS כותנה שחור בוגרים",
    cardText: "ג'קט עם רוכסן מכותנה לבוגרים בצבע שחור.",
    productUrl: "https://shop.maccabi.co.il/product/adidas-jacket-black/",
    upStashTable: 'ADIDAS 2025-26',
    oldPrice: 350,
    newPrice: 245,
    discount: 30
  },
  {
    url: "./partner2/3.png",
    prize: "./partner/3.png",
    coupon: "COUPONCODE",
    topText: "ג'קט ZNE ADIDAS סנד בוגרים",
    cardText: "ג'קט עם רוכסן לבוגרים בצבע בז'-סנד עם לוגו הקבוצה",
    productUrl: "https://shop.maccabi.co.il/product/adidas-jacketzne-sand/",
    upStashTable: 'ADIDAS 2025-26',
    oldPrice: 500,
    newPrice: 350,
    discount: 30
  }
];

const swipeLeft = (
  <svg
    style={{ width: "1em", height: "1em" }}
    width="57"
    height="49"
    viewBox="0 0 57 49"
    fill="none"
  >
    <path
      d="M47.634 0L56.85 7.68L22.644 48.726L0 26.082L8.484 17.598L21.834 30.954L47.634 0Z"
      fill="white"
    />
  </svg>
);
const swipeRight = (
  <svg
    style={{ width: "1em", height: "1em" }}
    width="51"
    height="51"
    viewBox="0 0 51 51"
    fill="none"
  >
    <path
      d="M25.4558 33.9411L42.4264 50.9117L50.9117 42.4264L33.9411 25.4558L50.9117 8.48528L42.4264 0L25.4558 16.9706L8.48528 0L0 8.48528L16.9706 25.4558L0 42.4264L8.48528 50.9117L25.4558 33.9411Z"
      fill="white"
    />
  </svg>
);
const startIcon = (
  <svg
    style={{ width: "0.75em", height: "0.75em" }}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path
      d="M15 18L9 12L15 6"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LoadingScreen = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return oldProgress + 10;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center z-50"
      style={{
        backgroundImage: "url(./partner/background.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
       <div className="w-64 h-64 relative mb-8">
         <div className="absolute inset-0 rounded-full border-4 border-black animate-spin border-t-transparent"></div>
         <div className="absolute inset-0 flex items-center justify-center">
           <span className="text-4xl font-bold text-black">{progress}%</span>
         </div>
       </div>
      <div className="text-2xl text-black font-bold animate-pulse ">
        {" "}
        טוען...
      </div>
    </div>
  );
};

export default function Home() {
  // Shuffle the database array once when component mounts
  const [shuffledDb] = useState(() => shuffleArray(db));
  
  const [currentIndex, setCurrentIndex] = useState(shuffledDb.length - 1);
  const [swipedRight, setSwipedRight] = useState(false);
  const [startSwiping, setStartSwiping] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [swipedOffers, setSwipedOffers] = useState([]);
  const [cycleComplete, setCycleComplete] = useState(false);
  const [winningIndex, setWinningIndex] = useState(null);
  const [winningProductUrl, setWinningProductUrl] = useState(null);
  const [winningProductInfo, setWinningProductInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [couponCode, setCouponCode] = useState(null);
  const [hasAlreadyPlayed, setHasAlreadyPlayed] = useState(false);
  const [anonymousToken, setAnonymousToken] = useState(null);
  const currentIndexRef = useRef(currentIndex);

  // Tag <html> with an .ios class client-side for robust CSS targeting
  useEffect(() => {
    if (isIosUserAgent()) {
      document.documentElement.classList.add('ios');
    } else {
      document.documentElement.classList.remove('ios');
    }
  }, []);

  const childRefs = useMemo(
    () =>
      Array(shuffledDb.length)
        .fill(0)
        .map(() => createRef()),
    [shuffledDb]
  );
  const canGoBack = currentIndex < shuffledDb.length - 1;
  const isIphone =
    typeof window !== "undefined" && /iPhone|iPod/.test(navigator.userAgent);

  // Initialize anonymous token and check if user has already played
  useEffect(() => {
    const initializeGame = async () => {
      const token = getOrCreateAnonymousToken();
      setAnonymousToken(token);
      
      // Check if user already has a coupon
      try {
        const response = await fetch('/api/check-coupon', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ anonymousToken: token }),
        });
        
        const data = await response.json();
        
        if (data.hasCoupon) {
          setHasAlreadyPlayed(true);
          setCouponCode(data.code);
          // Set the winning product info to show the proper winning screen
          if (data.productInfo) {
            // Find the product in the original database (not shuffled) by matching unique properties
            const originalProductIndex = db.findIndex(item => 
              item.cardText === data.productInfo.cardText && 
              item.productUrl === data.productInfo.productUrl
            );
            
            if (originalProductIndex !== -1) {
              // Find the same product in the current shuffled database
              const shuffledProductIndex = shuffledDb.findIndex(item => 
                item.cardText === data.productInfo.cardText && 
                item.productUrl === data.productInfo.productUrl
              );
              
              if (shuffledProductIndex !== -1) {
                setWinningIndex(shuffledProductIndex);
                setWinningProductUrl(data.productInfo.productUrl);
                setWinningProductInfo(data.productInfo); // Store the actual product info
                setShowMatch(true);
                setImagesLoaded(true); // Assume images are loaded for returning users
              }
            }
          }
        }
      } catch (error) {
        console.error('Error checking coupon:', error);
      }
      
      setCurrentIndex(shuffledDb.length - 1);
      setIsLoading(false);
    };
    
    initializeGame();
  }, []);

  const resetState = () => {
    setSwipedOffers([]);
    setCycleComplete(false);
    setWinningIndex(null);
    setCurrentIndex(shuffledDb.length - 1);
    setSwipedRight(false);
    setShowMatch(false);
    setStartSwiping(false);
  };

  // Preload images
  useEffect(() => {
    const loadImages = async () => {
      const imagePromises = shuffledDb.map((item) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = item.prize;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(imagePromises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error preloading images:", error);
      }
    };

    loadImages();
  }, []);

  const goBack = async (i) => {
    if (!canGoBack) return;
    if (!childRefs[i]?.current) return;
    updateCurrentIndex(i);
    try {
      await childRefs[i].current.restoreCard();
    } catch (error) {
      console.error("Error restoring card:", error);
    }
  };

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const swiped = async (direction, nameToDelete, index, productUrl) => {
    if (direction === "right" && index != shuffledDb.length) {
      setShowLoading(true);
      
      // Get the product info for this index
      const productInfo = shuffledDb[index];
      
      // Try to redeem a coupon
      try {
        const response = await fetch('/api/redeem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            anonymousToken,
            upStashTable: productInfo.upStashTable,
            productInfo: {
              ...productInfo,
              index: index
            }
          }),
        });
        
        const data = await response.json();
        
        if (data.success) {
          setCouponCode(data.code);
          // Don't set hasAlreadyPlayed here - let the user see the full flow first
        } else if (data.code) {
          // User already has a coupon
          setCouponCode(data.code);
          setHasAlreadyPlayed(true);
        }
      } catch (error) {
        console.error('Error redeeming coupon:', error);
      }
      
      // Add to swiped offers and set winning index
      setSwipedOffers((prev) => [...prev, index]);
      setWinningIndex(index);
      // Store the product URL for the button
      setWinningProductUrl(productUrl);
      setWinningProductInfo(productInfo); // Store the actual product info
      setTimeout(() => {
        setShowConfetti(true);
      }, 1500);
      setTimeout(() => {
        if (imagesLoaded) {
          setShowMatch(true);
          setShowLoading(false);
          // Set hasAlreadyPlayed to true after showing the winning screen
          setHasAlreadyPlayed(true);
        }
      }, 2000);
      return;
    }

    // Handle left swipe
    setSwipedOffers((prev) => [...prev, index]);
    updateCurrentIndex(index - 1);

  // Check if this was the last offer - let the exhaustion effect handle reloop
  if (index === 0) {
      // Do nothing here; the exhaustion effect (currentIndex === -1) will reloop
    }
  };

  useEffect(() => {
    if (currentIndex < 0) {
      const restoreAll = async () => {
        // Clear hidden indices so cards render again
        setSwipedOffers([]);
        // Restore all cards visually
        for (let i = 0; i < shuffledDb.length; i++) {
          const ref = childRefs[i]?.current;
          if (ref && typeof ref.restoreCard === 'function') {
            try {
              // Await sequentially to avoid animations clashing
              // eslint-disable-next-line no-await-in-loop
              await ref.restoreCard();
            } catch (e) {
              // ignore
            }
          }
        }
        // Reset index to top of the deck
        setCurrentIndex(shuffledDb.length - 1);
      };
      restoreAll();
    }
  }, [currentIndex, childRefs, shuffledDb.length]);

  const swipe = async (dir) => {
    if (
      currentIndex >= 0 &&
      currentIndex < shuffledDb.length &&
      childRefs[currentIndex]?.current
    ) {
      try {
        const card = childRefs[currentIndex].current;
        // Use the swipe method directly without any delay
        card.swipe(dir);
      } catch (error) {
        console.error("Error swiping card:", error);
      }
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="text-black min-h-[100svh] overflow-hidden">
      <main className="flex flex-col items-center">
        <OnboardingTour 
          hasAlreadyPlayed={hasAlreadyPlayed}
          startSwiping={startSwiping}
          setHasAlreadyPlayed={setHasAlreadyPlayed}
        />
        {!startSwiping && !showMatch && (
          <div className="relative w-full h-screen">
            {/* Картинка для компьютера - без изменений */}
            <img
              src="./partner/startpage.png"
              className="hidden md:block w-full h-full object-contain"
              alt="Start Page"
            />

            {/* Картинка для телефона - растягивается на весь экран */}
            <img
              src="./partner/startpage.png"
              className="block md:hidden w-full h-full object-cover"
              alt="Start Page"
            />

            {/* Кликабельная область в нижних 50% экрана */}
            <div
              className="absolute bottom-0 left-0 w-full h-1/2 cursor-pointer"
              onClick={() => setStartSwiping(true)}
            />
          </div>
        )}

        {startSwiping && !showMatch && !swipedRight && !showLoading && (
          <>
            <div className="w-full max-w-md mb-4 flex flex-col items-center">
              <img
                src="./partner/header.png"
                className="w-3/5 h-auto object-cover"
              />
               {/* <p className="text-black text-2xl font-bold mt-2 text-center">
                 הקמפיין שתשגע את ישראל!
               </p> */}
            </div>
            <div className="swipeButtonContainer">
              <button
                className="swipeButtons swipeLeft"
                onClick={() => swipe("right")}
              >
                {swipeLeft}
              </button>
              <button
                className="swipeButtons swipeRight"
                onClick={() => swipe("left")}
              >
                {swipeRight}
              </button>
            </div>
            <div className="cardContainer">
              {shuffledDb.map(
                (item, index) =>
                  !swipedOffers.includes(index) && (
                    <TinderCard
                      preventSwipe={["up", "down"]}
                      ref={childRefs[index]}
                      className="swipe"
                      key={index}
                      swipeRequirementFulfilled={true}
                      swipeThreshold={0.1}
                      flickOnSwipe={true}
                      onCardLeftScreen={(dir) => {
                        if (dir === "left" || dir === "right") {
                          swiped(dir, item.prize, index, item.productUrl);
                        }
                      }}
                      style={{
                        position: "absolute",
                        width: "100%",
                        height: "100%",
                        willChange: "transform",
                        transition: "transform 0.3s ease-out",
                      }}
                    >
                       <div className="card ios-card" style={{ marginTop: isIosUserAgent() ?  "12px" : undefined }}>
                         {/* Top Text */}
                         {item.topText && (
                           <div className="topCardTextContainer">
                             <div className="topText">{item.topText}</div>
                           </div>
                         )}
                         
                         {/* Product Image */}
                         <div className="cardImageContainer">
                           <img
                             src={item.url}
                             alt=""
                             className="w-full h-full object-contain"
                             style={{
                               // On iOS, scale image to 53.34% (0.6667 * 0.8) to reduce oversized rendering
                               // On other devices, scale to 80% (20% smaller)
                               transform: isIosUserAgent() ? "scale(0.6667)" : "scale(0.75)",
                               transformOrigin: "center center",
                             }}
                           />
                         </div>
                         
                         {/* Bottom Text - Product Name and Price */}
                         <div className="bottomCardTextContainer">
                           <div className="productInfo">
                             {item.oldPrice && item.newPrice ? (
                               <>
                                 <div className="productName">{item.cardText}</div>
                                 <div className="priceContainer">
                                   <span className="newPrice">
                                     ₪{item.newPrice}.00
                                   </span>
                                   <span className="oldPrice">
                                     ₪{item.oldPrice}.00
                                   </span>
                                 </div>
                               </>
                             ) : (
                               <div className="productNameOnly">{item.cardText}</div>
                             )}
                           </div>
                         </div>
                       </div>
                    </TinderCard>
                  )
              )}
            </div>
            <div className="fixed bottom-0 left-0 right-0 flex flex-col items-center z-10">
              <p
                className="text-black text-lg font-bold ios-shift-down"
              >
                החליקו ובחרו על איזה מוצר תרצו לקבל
              </p>
              <div className="bg-[#14D3C9] px-8 pb-4 pt-2 rounded-lg">
                <p
                  className="text-white text-6xl font-bold bottomBannerText"
                  style={{
                    textShadow: '3px 3px 0px rgba(0,0,0,0.9)',
                    transform: isIosUserAgent() ? 'scale(0.8)' : undefined,
                    transformOrigin: 'center center',
                  }}
                >
                  ₪100 הנחה
                </p>
              </div>
            </div>
          </>
        )}

        {showLoading && <LoadingScreen />}
        {showMatch && imagesLoaded && (
          <>
            <div className="w-full max-w-md mb-4 flex flex-col items-center">
              <img
                src="./partner/header.png"
                className="w-3/5 h-auto object-cover"
              />
            </div>
            <MatchScreen
              currentIndex={currentIndex}
              showConfetti={showConfetti}
              productUrl={winningProductUrl}
              couponCode={couponCode}
              winningProductInfo={winningProductInfo}
            />
          </>
        )}
      </main>
    </div>
  );
}

const MatchScreen = ({ currentIndex, showConfetti, productUrl, couponCode, winningProductInfo }) => {
  const { width, height } = useWindowSize();
  const [isVisible, setIsVisible] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Use the winning product info directly instead of looking it up by index
  if (!winningProductInfo) {
    return null;
  }

  const currentPrize = winningProductInfo.prize;
  const currentCoupon = winningProductInfo.coupon;
  const currentTopText = winningProductInfo.topText;
  const currentCardText = winningProductInfo.cardText;
  
  if (!currentPrize) {
    return null;
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative" style={{ zIndex: 1 }}>
      <Fireworks show={showConfetti} width={width} height={height} />
      <div className="flex justify-center w-full">
        <div style={{ transform: isIosUserAgent() ? 'scale(0.85)' : undefined, transformOrigin: 'top center', display: 'inline-block' }}>
          <div
            className={`w-[88%] max-w-lg h-auto bg-white rounded-lg flex flex-col items-center justify-start py-4 transition-all duration-700 ease-out ${
              isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0"
            }`}
            style={{
              transformOrigin: "center center",
              position: "relative",
              zIndex: 2,
              paddingTop: '4%',
              paddingBottom: '4%',
              marginLeft: 'auto',
              marginRight: 'auto',
            }}
          >
          {/* Дополнительный текст над карточкой */}
          <div className="text-center mb-2" style={{ marginTop: '3%' }}>
            <p className="text-black text-lg font-bold mb-0">איזה כיף! קיבלתם מאיתנו</p>
            <p className="text-black text-5xl font-bold mb-0" style={{ textShadow: '2px 2px 0px #14D3C9' }}>₪100 הנחה</p>
            {/* {currentTopText && (
              <p className="text-black text-xl font-bold">{currentTopText}</p>
            )} */}
          </div>

          {/* Coupon Code Display */}
          {couponCode && (
            <div className="text-center mb-3" style={{ marginTop: '12px' }}>
              <p className="text-black text-lg font-bold mb-1.5">קוד קופון לאתר פרטנר:</p>
              <div className="bg-gradient-to-r from-[#14D3C9] to-[#0ea5e9] text-white px-6 py-2.5 rounded-lg mb-1.5 shadow-lg border-2 border-dashed border-white">
                <p className="text-2xl font-bold">{couponCode}</p>
              </div>
              {/* <p className="text-black text-sm">השתמשו בקוד הזה באתר שלנו</p> */}
            </div>
          )}

          {/* Товар */}
          <div className="flex flex-col items-center mb-2" >
            <img
              src={currentPrize}
              alt="Winning Prize"
              className="w-2/5 md:w-1/5"
              style={{
                transform: animationComplete ? "none" : "scale(1)",
                transition: "transform 700ms ease-out",
              }}
            />
          </div>

          {/* Описание товара */}
          {currentCardText && (
            <div className="text-center mb-2" >
              <p className="text-black text-xl font-bold">{currentCardText}</p>
            </div>
          )}

          {/* Кнопка */}
          <div className="text-center" style={{ marginTop: '12px' }}>
            <button
              className={`text-white px-7 py-2.5 rounded-lg font-bold text-lg transition-all ${
                isLoading 
                  ? 'loading-button' 
                  : 'bg-[#14D3C9] hover:bg-[#12c0b8]'
              }`}
              disabled={isLoading}
              onClick={() => {
                setIsLoading(true);
                console.log("Match button clicked");
                setTimeout(() => {
                  window.location.href = productUrl || "https://keds.co.il/collections/all-outlet-items";
                }, 100);
              }}
            >
              {isLoading ? "Loading" : "למימוש באתר לחצו כאן"}
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};
