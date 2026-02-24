import { useNavigate } from 'react-router-dom';
import { Sun, Shield } from 'lucide-react';
import SeniorLayout from '@/components/SeniorLayout';
import { useApp } from '@/context/AppContext';

const Welcome = () => {
  const navigate = useNavigate();
  const { t } = useApp();

  const hour = new Date().getHours();
  const greeting = hour < 12
    ? t('Good Morning! ☀️', 'सुप्रभात! ☀️')
    : hour < 17
    ? t('Good Afternoon! 🌤️', 'नमस्कार! 🌤️')
    : t('Good Evening! 🌙', 'शुभ संध्या! 🌙');

  return (
    <SeniorLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-glow-primary mb-6 animate-slide-up">
          <Sun className="w-12 h-12 text-primary-foreground" />
        </div>

        <h2 className="text-elder-2xl font-black text-foreground animate-slide-up-delay-1">
          {greeting}
        </h2>
        <p className="text-elder-lg text-muted-foreground font-semibold mt-2 animate-slide-up-delay-2">
          {t('How can I help you today?', 'आज मैं आपकी कैसे मदद कर सकता हूँ?')}
        </p>

        <button
          onClick={() => navigate('/senior/home')}
          className="mt-10 w-full elder-tile gradient-warm text-secondary-foreground flex-col gap-2 text-elder-xl py-8 animate-slide-up-delay-3"
        >
          <span className="text-3xl">🌅</span>
          <span>{t('Start My Day', 'मेरा दिन शुरू करें')}</span>
        </button>

        <div className="flex items-center gap-2 mt-6 text-muted-foreground animate-slide-up-delay-4">
          <Shield className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold">{t('You are protected by Digital Guardian', 'डिजिटल गार्डियन आपकी सुरक्षा कर रहा है')}</span>
        </div>
      </div>
    </SeniorLayout>
  );
};

export default Welcome;
