import { Pill, UtensilsCrossed, SmilePlus, Clock, Wifi, Battery, AlertTriangle } from 'lucide-react';
import CaregiverLayout from '@/components/CaregiverLayout';
import { useApp } from '@/context/AppContext';
import { caregiverOverview } from '@/data/dummyData';

const d = caregiverOverview;

const Overview = () => {
  const { t } = useApp();

  return (
    <CaregiverLayout>
      {/* Status Banner */}
      <div className="gradient-hero rounded-elder p-5 text-primary-foreground mb-6 shadow-glow-primary animate-slide-up">
        <p className="text-sm font-semibold opacity-80">{t('Today\'s Summary', 'आज का सारांश')}</p>
        <h2 className="text-2xl font-black mt-1">{t('Ramesh Kumar', 'रमेश कुमार')}</h2>
        <div className="flex items-center gap-2 mt-2 opacity-80">
          <Clock className="w-4 h-4" />
          <span className="text-sm font-semibold">{t(`Last active: ${d.lastActive}`, `अंतिम सक्रिय: ${d.lastActiveHi}`)}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Medication Adherence */}
        <div className="bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-1">
          <div className="flex items-center gap-2 mb-2">
            <Pill className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-muted-foreground">{t('Medicines', 'दवाइयाँ')}</span>
          </div>
          <p className="text-3xl font-black text-foreground">{d.medicationAdherence}%</p>
          <p className="text-xs text-muted-foreground font-semibold">{t('adherence today', 'आज का पालन')}</p>
        </div>

        {/* Mood */}
        <div className="bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-2">
          <div className="flex items-center gap-2 mb-2">
            <SmilePlus className="w-5 h-5 text-secondary" />
            <span className="text-sm font-bold text-muted-foreground">{t('Mood', 'मूड')}</span>
          </div>
          <p className="text-3xl font-black text-foreground">🙂</p>
          <p className="text-xs text-muted-foreground font-semibold">{t(d.moodToday, d.moodTodayHi)}</p>
        </div>

        {/* Meals */}
        <div className="bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-3">
          <div className="flex items-center gap-2 mb-2">
            <UtensilsCrossed className="w-5 h-5 text-warning" />
            <span className="text-sm font-bold text-muted-foreground">{t('Meals', 'भोजन')}</span>
          </div>
          <div className="flex gap-2 mt-1">
            {[
              { label: 'B', done: d.mealsToday.breakfast },
              { label: 'L', done: d.mealsToday.lunch },
              { label: 'D', done: d.mealsToday.dinner },
            ].map(m => (
              <span key={m.label} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${m.done ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}`}>
                {m.label}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground font-semibold mt-2">{t('1 of 3 confirmed', '3 में से 1 पुष्टि')}</p>
        </div>

        {/* Connectivity */}
        <div className="bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-4">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-5 h-5 text-success" />
            <span className="text-sm font-bold text-muted-foreground">{t('Status', 'स्थिति')}</span>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Wifi className="w-3 h-3 text-success" />
              <span className="text-xs font-bold text-foreground">{t(d.internetStatus, d.internetStatusHi)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Battery className="w-3 h-3 text-warning" />
              <span className="text-xs font-bold text-foreground">{d.batteryLevel}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="mt-6 bg-destructive/5 rounded-elder p-4 border border-destructive/20 animate-slide-up-delay-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <span className="font-bold text-foreground">{t('Active Alerts', 'सक्रिय अलर्ट')}: {d.weeklyAlertCount}</span>
        </div>
        <p className="text-sm text-muted-foreground font-semibold mt-1">{t('1 critical alert requires attention', '1 गंभीर अलर्ट पर ध्यान दें')}</p>
      </div>
    </CaregiverLayout>
  );
};

export default Overview;
