import { useState } from 'react';
import SeniorLayout from '@/components/SeniorLayout';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

type Mood = 'good' | 'okay' | 'not_well' | null;
type PainArea = string | null;

const painAreas = [
  { en: 'Head', hi: 'सिर', emoji: '🤕' },
  { en: 'Chest', hi: 'छाती', emoji: '💔' },
  { en: 'Stomach', hi: 'पेट', emoji: '🤢' },
  { en: 'Back', hi: 'पीठ', emoji: '😣' },
  { en: 'Legs', hi: 'पैर', emoji: '🦵' },
  { en: 'Other', hi: 'अन्य', emoji: '📍' },
];

const Wellbeing = () => {
  const { t, setWellbeing, addAlert } = useApp();
  const [mood, setMood] = useState<Mood>(null);
  const [painArea, setPainArea] = useState<PainArea>(null);

  const handleMood = async (selected: Mood) => {
    setMood(selected);
    if (selected !== 'not_well') {
      await setWellbeing({ mood: selected, painArea: null, timestamp: new Date().toISOString() });
      toast({ title: selected === 'good' ? t('😊 Glad to hear!', '😊 सुनकर खुशी हुई!') : t('🙂 Take care!', '🙂 ध्यान रखें!') });
    }
  };

  const handlePain = async (area: string) => {
    setPainArea(area);
    await setWellbeing({ mood: 'not_well', painArea: area, timestamp: new Date().toISOString() });
    await addAlert({
      type: 'distress',
      message: `Reported feeling unwell – ${area.toLowerCase()} area`,
      messageHi: `अस्वस्थ महसूस किया – ${area.toLowerCase()} क्षेत्र`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      severity: 'critical',
    });
    toast({
      title: t('🚨 Caregiver Alerted!', '🚨 देखभालकर्ता को सूचित किया गया!'),
      description: t(`Pain reported in: ${area}. Help is coming.`, `दर्द की जगह: ${area}। मदद आ रही है।`),
      variant: 'destructive',
    });
  };

  return (
    <SeniorLayout title={t('How Are You?', 'आप कैसे हैं?')} showBack>
      <div className="flex flex-col items-center text-center">
        {!mood ? (
          <>
            <span className="text-6xl mb-6 animate-slide-up">💭</span>
            <h2 className="text-elder-2xl font-black text-foreground mb-8 animate-slide-up-delay-1">
              {t('How are you feeling?', 'आप कैसा महसूस कर रहे हैं?')}
            </h2>

            <div className="w-full space-y-4">
              <button onClick={() => handleMood('good')} className="w-full elder-tile bg-success text-success-foreground text-elder-xl py-6 animate-slide-up-delay-2">
                😊 {t('Good', 'अच्छा')}
              </button>
              <button onClick={() => handleMood('okay')} className="w-full elder-tile bg-secondary text-secondary-foreground text-elder-xl py-6 animate-slide-up-delay-3">
                🙂 {t('Okay', 'ठीक')}
              </button>
              <button onClick={() => handleMood('not_well')} className="w-full elder-tile gradient-emergency text-destructive-foreground text-elder-xl py-6 shadow-glow-emergency animate-slide-up-delay-4">
                😟 {t('Not Well', 'अच्छा नहीं')}
              </button>
            </div>
          </>
        ) : mood === 'not_well' && !painArea ? (
          <>
            <span className="text-5xl mb-4 animate-slide-up">😟</span>
            <h2 className="text-elder-xl font-black text-foreground mb-6 animate-slide-up-delay-1">
              {t('Where does it hurt?', 'कहाँ दर्द हो रहा है?')}
            </h2>
            <div className="w-full grid grid-cols-2 gap-3">
              {painAreas.map((area, i) => (
                <button
                  key={area.en}
                  onClick={() => handlePain(area.en)}
                  className={`elder-tile bg-card text-foreground flex-col gap-2 py-5 border-2 border-destructive/20 animate-slide-up-delay-${Math.min(i + 1, 5)}`}
                >
                  <span className="text-2xl">{area.emoji}</span>
                  <span className="text-elder-lg">{t(area.en, area.hi)}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="min-h-[50vh] flex flex-col items-center justify-center animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <h2 className="text-elder-xl font-black text-foreground">
              {t('Response Recorded', 'जवाब दर्ज किया गया')}
            </h2>
            <p className="text-muted-foreground font-semibold mt-2">
              {mood === 'not_well'
                ? t('Your caregiver has been notified.', 'आपके देखभालकर्ता को सूचित किया गया है।')
                : t('Stay healthy and happy!', 'स्वस्थ और खुश रहें!')
              }
            </p>
          </div>
        )}
      </div>
    </SeniorLayout>
  );
};

export default Wellbeing;
