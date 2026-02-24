import { useNavigate } from 'react-router-dom';
import { Shield, Heart, Users } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import LanguageToggle from '@/components/LanguageToggle';

const Index = () => {
  const navigate = useNavigate();
  const { t, setRole } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 max-w-md mx-auto">
      {/* Language toggle top right */}
      <div className="absolute top-5 right-5">
        <LanguageToggle />
      </div>

      {/* Logo */}
      <div className="animate-slide-up mb-2">
        <div className="w-20 h-20 rounded-2xl gradient-hero flex items-center justify-center shadow-glow-primary mx-auto">
          <Shield className="w-10 h-10 text-primary-foreground" />
        </div>
      </div>

      <h1 className="text-elder-2xl font-black text-foreground text-center mt-5 animate-slide-up-delay-1">
        {t('Digital Guardian', 'डिजिटल गार्डियन')}
      </h1>
      <p className="text-muted-foreground text-center font-semibold mt-2 animate-slide-up-delay-2">
        {t('Smart Elder Care', 'स्मार्ट बुज़ुर्ग देखभाल')}
      </p>

      <div className="w-full mt-10 space-y-4">
        {/* Senior Button */}
        <button
          onClick={() => { setRole('senior'); navigate('/senior'); }}
          className="w-full elder-tile gradient-primary text-primary-foreground flex-col gap-3 text-elder-xl animate-slide-up-delay-3"
        >
          <Heart className="w-10 h-10" />
          <span>{t('I am a Senior', 'मैं बुज़ुर्ग हूँ')}</span>
          <span className="text-sm font-semibold opacity-80">{t('Simple & Easy Interface', 'सरल और आसान')}</span>
        </button>

        {/* Caregiver Button */}
        <button
          onClick={() => { setRole('caregiver'); navigate('/caregiver'); }}
          className="w-full elder-tile bg-card text-foreground flex-col gap-3 text-elder-xl border-2 border-primary/20 animate-slide-up-delay-4"
        >
          <Users className="w-10 h-10 text-primary" />
          <span>{t('I am a Caregiver', 'मैं देखभालकर्ता हूँ')}</span>
          <span className="text-sm font-semibold text-muted-foreground">{t('Dashboard & Controls', 'डैशबोर्ड और नियंत्रण')}</span>
        </button>
      </div>

      <p className="text-xs text-muted-foreground mt-8 text-center animate-slide-up-delay-5">
        {t('Made with ❤️ for India\'s elderly', 'भारत के बुज़ुर्गों के लिए ❤️ से बनाया गया')}
      </p>
    </div>
  );
};

export default Index;
