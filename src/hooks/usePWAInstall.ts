import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://') ||
        localStorage.getItem('pwa_installed') === 'true'
      );
    } catch {
      return false;
    }
  });
  const [isIOS, setIsIOS] = useState(false);
  const [isIframe, setIsIframe] = useState(false);

  useEffect(() => {
    // Detect standalone mode (already running as installed PWA or marked installed in storage)
    let isStandalone = false;
    try {
      isStandalone =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
        document.referrer.includes('android-app://') ||
        localStorage.getItem('pwa_installed') === 'true';
    } catch {
      isStandalone = false;
    }

    if (isStandalone) {
      setIsInstalled(true);
      try {
        localStorage.setItem('pwa_installed', 'true');
      } catch {}
    }

    // Detect iOS devices
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIOSDevice);

    // Detect iframe
    try {
      setIsIframe(window.self !== window.top);
    } catch {
      setIsIframe(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      // If already installed or dismissed, never trigger or show prompt
      try {
        if (
          localStorage.getItem('pwa_installed') === 'true' ||
          localStorage.getItem('pwa_dismissed') === 'true'
        ) {
          return;
        }
      } catch {}

      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('pwa_installed', 'true');
      } catch {}
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return false;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
      try {
        localStorage.setItem('pwa_installed', 'true');
      } catch {}
      return true;
    }
    return false;
  };

  return {
    isInstallable: !isInstalled && !!deferredPrompt,
    isInstalled,
    isIOS,
    isIframe,
    install,
  };
}
