import { useApp } from '@/context/AppContext';
import { Globe } from 'lucide-react';

const LanguageToggle = () => {
  const { language, setLanguage } = useApp();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
      className="flex items-center gap-2 px-4 py-2 rounded-full bg-card shadow-card text-foreground font-bold text-sm transition-all active:scale-95"
    >
      <Globe className="w-4 h-4" />
      {language === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
};

export default LanguageToggle;
