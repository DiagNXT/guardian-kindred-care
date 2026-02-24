import { useState } from 'react';
import { Check, Clock } from 'lucide-react';
import SeniorLayout from '@/components/SeniorLayout';
import { useApp } from '@/context/AppContext';
import { medicines as initialMedicines } from '@/data/dummyData';
import { toast } from '@/hooks/use-toast';

const Medicines = () => {
  const { t } = useApp();
  const [meds, setMeds] = useState(initialMedicines);

  const handleTaken = (id: number) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, taken: true } : m));
    toast({ title: t('✅ Medicine marked as taken!', '✅ दवाई ली गई!') });
  };

  const handleRemind = (id: number) => {
    toast({ title: t('⏰ Reminder set for 30 minutes', '⏰ 30 मिनट का रिमाइंडर सेट') });
  };

  return (
    <SeniorLayout title={t('My Medicines', 'मेरी दवाइयाँ')} showBack>
      <div className="space-y-4">
        {meds.map((med, i) => (
          <div
            key={med.id}
            className={`bg-card rounded-elder p-5 shadow-card animate-slide-up-delay-${Math.min(i + 1, 5)} ${med.taken ? 'opacity-70' : ''}`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-elder-lg font-bold text-foreground">{t(med.name, med.nameHi)}</h3>
                <p className="text-muted-foreground font-semibold">🕐 {med.time}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                med.tag === 'Before Food' ? 'bg-secondary text-secondary-foreground' : 'bg-accent text-accent-foreground'
              }`}>
                {t(med.tag, med.tagHi)}
              </span>
            </div>

            {med.taken ? (
              <div className="flex items-center gap-2 text-success font-bold text-elder-lg">
                <Check className="w-6 h-6" />
                {t('Taken', 'ली गई')}
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => handleTaken(med.id)}
                  className="flex-1 elder-tile bg-success text-success-foreground py-3 min-h-0 text-base"
                >
                  <Check className="w-5 h-5 mr-2" />
                  {t('Taken', 'ली गई')}
                </button>
                <button
                  onClick={() => handleRemind(med.id)}
                  className="flex-1 elder-tile bg-muted text-foreground py-3 min-h-0 text-base"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  {t('Remind Later', 'बाद में याद दिलाएं')}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </SeniorLayout>
  );
};

export default Medicines;
