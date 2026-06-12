import React, { useState, useEffect } from 'react';

const InstallBanner = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if dismissed recently
    const dismissed = localStorage.getItem('installBannerDismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        return; // Don't show if dismissed within 7 days
      }
    }

    // Check if iOS
    const ua = window.navigator.userAgent;
    const webkit = !!ua.match(/WebKit/i);
    const isIOSDevice = !!ua.match(/iPad/i) || !!ua.match(/iPhone/i);
    const isSafari = isIOSDevice && webkit && !ua.match(/CriOS/i);
    
    // Check if already in standalone mode
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

    if (isStandalone) {
      return;
    }

    if (isSafari) {
      setIsIOS(true);
      // Show iOS banner after 30 seconds
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 30000);
      return () => clearTimeout(timer);
    }

    // Handle beforeinstallprompt for Android/Chrome
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Show banner after 30 seconds
      setTimeout(() => {
        setShowBanner(true);
      }, 30000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('installBannerDismissed', Date.now().toString());
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-50 animate-slide-up">
      <div className="bg-[#1f1f1f] rounded-2xl shadow-2xl p-5 border border-[#333] max-w-md mx-auto text-white">
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-app-green/20 p-2 rounded-xl">
              <span className="text-2xl">📲</span>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Add to Home Screen</h3>
              {isIOS ? (
                <p className="text-sm text-gray-400">
                  Tap <span className="inline-block border border-gray-600 rounded px-1 mx-1">Share</span> 
                  then <span className="font-medium text-white">"Add to Home Screen"</span> for the best experience.
                </p>
              ) : (
                <p className="text-sm text-gray-400">
                  Install the app for the best experience and offline access.
                </p>
              )}
            </div>
          </div>
          
          <div className="flex gap-3 mt-2">
            {!isIOS && (
              <button 
                onClick={handleInstall}
                className="flex-1 bg-app-green text-black font-bold py-2.5 px-4 rounded-xl active:scale-95 transition-transform"
              >
                Install App
              </button>
            )}
            <button 
              onClick={handleDismiss}
              className={`font-semibold py-2.5 px-4 rounded-xl transition-colors ${
                isIOS 
                  ? 'flex-1 bg-white/10 hover:bg-white/20 text-white w-full' 
                  : 'flex-1 border border-white/20 text-white hover:bg-white/10 active:scale-95 transition-transform'
              }`}
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallBanner;
