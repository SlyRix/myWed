import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [prompt, setPrompt] = useState(null);
  const [dismissed, setDismissed] = useState(() => !!localStorage.getItem('pwaInstallDismissed'));

  useEffect(() => {
    const handler = e => { e.preventDefault(); setPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!prompt || dismissed) return null;

  const install = async () => {
    prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') setPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem('pwaInstallDismissed', '1');
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 bg-brown text-white rounded-2xl p-4 shadow-xl flex items-center gap-3">
      <span className="text-3xl flex-shrink-0">📱</span>
      <div className="flex-1 min-w-0">
        <p className="font-body font-medium text-sm">Add to Home Screen</p>
        <p className="font-body text-white/60 text-xs">Open the gallery like a native app</p>
      </div>
      <div className="flex gap-2 flex-shrink-0">
        <button onClick={dismiss} className="text-white/50 hover:text-white font-body text-xs px-2">Later</button>
        <button onClick={install} className="bg-gold text-white font-body text-xs font-medium px-3 py-2 rounded-xl">Install</button>
      </div>
    </div>
  );
}
