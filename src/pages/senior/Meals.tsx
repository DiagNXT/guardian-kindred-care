import { useState } from 'react';
import SeniorLayout from '@/components/SeniorLayout';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const Meals = () => {
  const { t } = useApp();
  const [answered, setAnswered] = useState(false);

  const handleYes = () => {
    setAnswered(true);
    toast({ title: t('🎉 Great! Stay healthy!', '🎉 बहुत बढ़िया! स्वस्थ रहें!') });
  };

  const handleNotYet = () => {
    setAnswered(true);
    toast({ title: t('⏰ Reminder set for 30 minutes', '⏰ 30 मिनट का रिमाइंडर सेट') });
  };

  const mealTime = (() => {
    const hour = new Date().getHours();
    if (hour < 11) return t('Breakfast', 'नाश्ता');
    if (hour < 15) return t('Lunch', 'दोपहर का खाना');
    return t('Dinner', 'रात का खाना');
  })();

  return (
    <SeniorLayout title={t('Meal Check', 'भोजन जाँच')} showBack>
      <div className="flex flex-col items-center justify-center min-h-[55vh] text-center">
        <span className="text-6xl mb-6 animate-slide-up">🍽️</span>
        <h2 className="text-elder-2xl font-black text-foreground animate-slide-up-delay-1">
          {t(`Have you had your ${mealTime}?`, `क्या आपने ${mealTime} खाया?`)}
        </h2>

        {!answered ? (
          <div className="w-full mt-10 space-y-4">
            <button onClick={handleYes} className="w-full elder-tile bg-success text-success-foreground text-elder-xl py-6 animate-slide-up-delay-2">
              ✅ {t('Yes, I ate!', 'हाँ, खा लिया!')}
            </button>
            <button onClick={handleNotYet} className="w-full elder-tile bg-secondary text-secondary-foreground text-elder-xl py-6 animate-slide-up-delay-3">
              ⏰ {t('Not Yet', 'अभी नहीं')}
            </button>
          </div>
        ) : (
          <div className="mt-10 animate-slide-up">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">✅</span>
            </div>
            <p className="text-elder-lg text-muted-foreground font-semibold">
              {t('Response recorded!', 'आपका जवाब दर्ज किया गया!')}
            </p>
          </div>
        )}
      </div>
    </SeniorLayout>
  );
};

export default Meals;
