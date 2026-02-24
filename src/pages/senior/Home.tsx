import { useNavigate } from 'react-router-dom';
import { Pill, UtensilsCrossed, SmilePlus, Phone, AlertTriangle } from 'lucide-react';
import SeniorLayout from '@/components/SeniorLayout';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const tiles = [
  { path: '/senior/medicines', icon: Pill, labelEn: 'My Medicines', labelHi: 'मेरी दवाइयाँ', color: 'gradient-primary', emoji: '💊' },
  { path: '/senior/meals', icon: UtensilsCrossed, labelEn: 'Did You Eat?', labelHi: 'क्या आपने खाना खाया?', color: 'bg-secondary', emoji: '🍛' },
  { path: '/senior/wellbeing', icon: SmilePlus, labelEn: 'How Are You Feeling?', labelHi: 'आप कैसा महसूस कर रहे हैं?', color: 'bg-accent text-accent-foreground', emoji: '😊' },
];

const Home = () => {
  const navigate = useNavigate();
  const { t } = useApp();

  const handleCall = () => {
    toast({
      title: t('📞 Calling Caregiver...', '📞 देखभालकर्ता को कॉल कर रहे हैं...'),
      description: t('Connecting you now.', 'अभी जोड़ रहे हैं।'),
    });
  };

  const handleEmergency = () => {
    toast({
      title: t('🚨 Emergency Alert Sent!', '🚨 आपातकालीन अलर्ट भेजा गया!'),
      description: t('Help is on the way.', 'मदद आ रही है।'),
      variant: 'destructive',
    });
  };

  return (
    <SeniorLayout title={t('Home', 'होम')} showBack>
      <div className="space-y-4">
        {tiles.map((tile, i) => (
          <button
            key={tile.path}
            onClick={() => navigate(tile.path)}
            className={`w-full elder-tile ${tile.color} text-primary-foreground flex gap-4 items-center justify-start px-6 text-left animate-slide-up-delay-${i + 1}`}
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className="text-3xl">{tile.emoji}</span>
            <span className="text-elder-xl">{t(tile.labelEn, tile.labelHi)}</span>
          </button>
        ))}

        {/* Call Caregiver */}
        <button
          onClick={handleCall}
          className="w-full elder-tile bg-card text-foreground flex gap-4 items-center justify-start px-6 border-2 border-primary/20 animate-slide-up-delay-4"
        >
          <Phone className="w-8 h-8 text-primary" />
          <span className="text-elder-xl">{t('Call Caregiver', 'देखभालकर्ता को कॉल करें')}</span>
        </button>

        {/* Emergency */}
        <button
          onClick={handleEmergency}
          className="w-full elder-tile gradient-emergency text-destructive-foreground flex gap-4 items-center justify-start px-6 shadow-glow-emergency animate-slide-up-delay-5"
        >
          <AlertTriangle className="w-8 h-8" />
          <span className="text-elder-xl font-black">{t('EMERGENCY', 'आपातकालीन')}</span>
        </button>
      </div>
    </SeniorLayout>
  );
};

export default Home;
