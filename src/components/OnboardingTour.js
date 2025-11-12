"use client";
import { useEffect } from "react";

const OnboardingTour = ({
  hasAlreadyPlayed,
  startSwiping,
  setHasAlreadyPlayed,
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!startSwiping) return;
    if (hasAlreadyPlayed) return;
    if (localStorage.getItem("playedTour") === "1") return;

    // Wait for targets to exist (poll up to 3s)
    let attempts = 0;
    const maxAttempts = 30;
    const waitForTarget = (onReady) => {
      const leftBtn = document.querySelector(".swipeButtons.swipeLeft");
      const rightBtn = document.querySelector(".swipeButtons.swipeRight");
      const card = document.querySelector(".cardContainer");
      const anySwipeCard = document.querySelector(".swipe");
      if (leftBtn && rightBtn && card && anySwipeCard) return onReady();
      attempts += 1;
      if (attempts >= maxAttempts) {
        console.warn("[Tour] targets not found after waiting");
        return;
      }
      setTimeout(() => waitForTarget(onReady), 1);
    };

    // Load Intro.js CSS and RTL CSS via CDN
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://cdn.jsdelivr.net/npm/intro.js@8.3.2/minified/introjs.min.css";
    document.head.appendChild(link);

    const rtlLink = document.createElement("link");
    rtlLink.rel = "stylesheet";
    rtlLink.href =
      "https://cdn.jsdelivr.net/npm/intro.js/introjs-rtl.css";
    document.head.appendChild(rtlLink);

    const startTour = async () => {
      try {
        let introFactory = null;
        let mod;
        try {
          mod = await import("intro.js/intro.js");
          introFactory = mod && (mod.default || mod.introJs);
          console.log("[Tour] loaded intro.js/intro.js");
        } catch (e1) {
          console.warn("[Tour] failed ESM path, trying package root", e1?.message);
          try {
            mod = await import("intro.js");
            introFactory = mod && (mod.default || mod.introJs);
            console.log("[Tour] loaded intro.js package root");
          } catch (e2) {
            console.warn("[Tour] dynamic import failed, falling back to CDN script", e2?.message);
            // Fallback: load UMD build via CDN and read window.introJs
            await new Promise((resolve, reject) => {
              if (window.introJs) return resolve();
              const script = document.createElement("script");
              script.src = "https://cdn.jsdelivr.net/npm/intro.js@8.3.2/minified/intro.min.js";
              script.async = true;
              script.onload = () => resolve();
              script.onerror = (err) => reject(err);
              document.head.appendChild(script);
            });
            introFactory = window.introJs;
            console.log("[Tour] loaded intro.js via CDN window.introJs");
          }
        }

        if (typeof introFactory !== "function") {
          console.error("[Tour] intro factory not found after all attempts");
          return;
        }

        const withFrame = (html) => `
          <div style="text-align:center; direction: rtl;">
            <img src="/assets/icons/partner/logo.png" alt="" style="max-width:140px; margin: 0 auto 8px; display:block;" />
            <div style="font-size:14px; line-height:1.45;">${html}</div>
          </div>
        `;

        const intro = (introFactory && introFactory.tour) ? introFactory.tour() : introFactory();
        intro.setOptions({
          steps: [
            {
              // New welcome step at the beginning
              position: "floating",
              intro: withFrame("ברוכים הבאים למשחק ההטבות של פרטנר<br/>בחרו על איזה מוצר תרצו לקבל 100 ש\"ח הנחה"),
            },
            {
              element: ".swipeButtons.swipeLeft",
              intro: withFrame("אהבתם את המוצר? לחצו כאן כדי לקבל עליו 30% הנחה!"),
              position: "left",
            },
            {
              element: ".swipeButtons.swipeRight",
              intro: withFrame("רוצים לקבל את ההנחה על מוצר אחר? לחצו כאן!"),
              position: "right",
            },
            {
              position: "floating",
              intro: withFrame("יש לכם רק בחירה אחת – בחרו בחוכמה! בהצלחה"),
            },
          ],
          nextLabel: "הבא",
          prevLabel: "חזרה",
          doneLabel: "להתחלה",
          showProgress: true,
          showBullets: false,
          scrollToElement: true,
          disableInteraction: false,
          rtl: true, // Enable RTL support
        });

        const completeOnce = () => {
          localStorage.setItem("playedTour", "1");
          setHasAlreadyPlayed(true);
        };

        intro.oncomplete(completeOnce);
        intro.onexit(completeOnce);
        intro.start();
      } catch (e) {
        console.error("[Tour] Failed to load/start Intro.js", e);
      }
    };

    const timer = setTimeout(() => waitForTarget(startTour), 1);

    return () => {
      clearTimeout(timer);
      const existing = document.querySelector(`link[href="${link.href}"]`);
      if (existing) existing.remove();
      const existingRtl = document.querySelector(`link[href="${rtlLink.href}"]`);
      if (existingRtl) existingRtl.remove();
    };
  }, [hasAlreadyPlayed, startSwiping, setHasAlreadyPlayed]);

  return null; // This component doesn't render anything
};

export default OnboardingTour;
