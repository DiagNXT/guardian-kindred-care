import { useState } from 'react';
import { Pill, UtensilsCrossed, SmilePlus, Clock, Wifi, Battery, AlertTriangle, Copy, CheckCircle2, RefreshCw, Link, Users, User, ChevronRight } from 'lucide-react';
import CaregiverLayout from '@/components/CaregiverLayout';
import { useApp } from '@/context/AppContext';
import { caregiverOverview } from '@/data/dummyData';

const d = caregiverOverview;

const moodEmoji = { good: '😊', okay: '🙂', not_well: '😟' } as const;
const moodLabels = { good: ['Good', 'अच्छा'], okay: ['Okay', 'ठीक'], not_well: ['Not Well', 'अच्छा नहीं'] } as const;

const Overview = () => {
  const { t, wellbeing, sharedMedicines, dynamicAlerts, pairingCode, generatePairingCode, activeSeniorId, activeSeniorName, linkedSeniors, setActiveSenior } = useApp();
  const [copied, setCopied] = useState(false);

  // If there are linked seniors but none is selected yet, show patient list only
  const showDashboard = activeSeniorId && linkedSeniors.length > 0;

  const takenCount = sharedMedicines.filter(m => m.taken).length;
  const totalMeds = sharedMedicines.length;
  const adherence = totalMeds > 0 ? Math.round((takenCount / totalMeds) * 100) : 0;
  const alertCount = dynamicAlerts.length;
  const criticalCount = dynamicAlerts.filter(a => a.severity === 'critical').length;

  const currentMoodEmoji = wellbeing?.mood ? moodEmoji[wellbeing.mood] : '—';
  const currentMoodLabel = wellbeing?.mood ? moodLabels[wellbeing.mood] : ['No data', 'कोई डेटा नहीं'];

  const handleCopyCode = () => {
    if (pairingCode) {
      navigator.clipboard.writeText(pairingCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <CaregiverLayout>
      {/* Pairing Code Card — always visible */}
      <div className="bg-card rounded-elder p-4 shadow-card border-2 border-primary/20 mb-4 animate-slide-up">
        <div className="flex items-center gap-2 mb-3">
          <Link className="w-5 h-5 text-primary" />
          <span className="text-sm font-bold text-foreground">{t('Add New Patient', 'नया मरीज़ जोड़ें')}</span>
        </div>

        {/* Large code display */}
        <div
          onClick={handleCopyCode}
          className="bg-muted/50 rounded-xl px-4 py-3 cursor-pointer hover:bg-muted transition-colors flex items-center justify-between"
        >
          <span className="text-3xl font-black text-primary tracking-[0.25em] font-mono">
            {pairingCode || '------'}
          </span>
          <div className="flex items-center gap-1 text-sm">
            {copied ? (
              <span className="flex items-center gap-1 text-success font-bold">
                <CheckCircle2 className="w-4 h-4" />
                {t('Copied', 'कॉपी')}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-muted-foreground font-semibold">
                <Copy className="w-4 h-4" />
                {t('Copy', 'कॉपी')}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          {t('Share this code with a patient to connect them. They will enter it in their app.', 'यह कोड मरीज़ को दें। वे इसे अपने ऐप में दर्ज करेंगे।')}
        </p>

        {/* Regenerate button */}
        <button
          type="button"
          onClick={() => { generatePairingCode(true); }}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border-2 border-primary/20 hover:border-primary/40 bg-primary/5 hover:bg-primary/10 transition-all text-primary font-bold text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          {t('Generate New Code', 'नया कोड बनाएं')}
        </button>
      </div>

      {/* My Patients Section */}
      <div className="mb-6 animate-slide-up-delay-1">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-black text-foreground">
            {t('My Patients', 'मेरे मरीज़')}
          </h3>
          <span className="ml-auto px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {linkedSeniors.length}
          </span>
        </div>

        {linkedSeniors.length === 0 ? (
          <div className="bg-muted/50 rounded-elder p-6 text-center border border-dashed border-muted-foreground/20">
            <User className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-muted-foreground">
              {t('No patients connected yet', 'अभी कोई मरीज़ नहीं जुड़ा')}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {t('Share your pairing code above to connect a patient.', 'ऊपर अपना पेयरिंग कोड साझा करें मरीज़ जोड़ने के लिए।')}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {linkedSeniors.map((link) => {
              const isActive = link.seniorId === activeSeniorId;
              return (
                <button
                  key={link.seniorId}
                  type="button"
                  onClick={() => setActiveSenior(link.seniorId)}
                  className={`w-full flex items-center gap-3 p-4 rounded-elder transition-all ${
                    isActive
                      ? 'bg-primary/10 border-2 border-primary shadow-card'
                      : 'bg-card border border-border hover:border-primary/30 shadow-card'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                    isActive ? 'gradient-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                  }`}>
                    {link.seniorName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-left">
                    <p className={`font-bold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                      {link.seniorName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('Connected', 'जुड़ा हुआ')} · {t('Code:', 'कोड:')} {link.code}
                    </p>
                  </div>
                  {isActive ? (
                    <span className="px-2 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      {t('Active', 'सक्रिय')}
                    </span>
                  ) : (
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Patient Dashboard — only shown when a patient is selected */}
      {showDashboard && (
        <>
          {/* Status Banner */}
          <div className="gradient-hero rounded-elder p-5 text-primary-foreground mb-6 shadow-glow-primary animate-slide-up-delay-2">
            <p className="text-sm font-semibold opacity-80">{t('Patient Dashboard', 'मरीज़ डैशबोर्ड')}</p>
            <h2 className="text-2xl font-black mt-1">{activeSeniorName}</h2>
            <div className="flex items-center gap-2 mt-2 opacity-80">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">{t(`Last active: ${d.lastActive}`, `अंतिम सक्रिय: ${d.lastActiveHi}`)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Medication Adherence */}
            <div className="bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-2">
              <div className="flex items-center gap-2 mb-2">
                <Pill className="w-5 h-5 text-primary" />
                <span className="text-sm font-bold text-muted-foreground">{t('Medicines', 'दवाइयाँ')}</span>
              </div>
              <p className="text-3xl font-black text-foreground">{adherence}%</p>
              <p className="text-xs text-muted-foreground font-semibold">
                {totalMeds > 0
                  ? `${takenCount}/${totalMeds} ${t('taken', 'ली गई')}`
                  : t('No medicines yet', 'अभी कोई दवाई नहीं')
                }
              </p>
            </div>

            {/* Mood */}
            <div className={`bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-3 ${wellbeing?.mood === 'not_well' ? 'border-2 border-destructive/30' : ''}`}>
              <div className="flex items-center gap-2 mb-2">
                <SmilePlus className="w-5 h-5 text-secondary" />
                <span className="text-sm font-bold text-muted-foreground">{t('Mood', 'मूड')}</span>
              </div>
              <p className="text-3xl font-black text-foreground">{currentMoodEmoji}</p>
              <p className={`text-xs font-semibold ${wellbeing?.mood === 'not_well' ? 'text-destructive' : 'text-muted-foreground'}`}>
                {t(currentMoodLabel[0], currentMoodLabel[1])}
                {wellbeing?.painArea && ` – ${wellbeing.painArea}`}
              </p>
            </div>

            {/* Meals */}
            <div className="bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-4">
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
            <div className="bg-card rounded-elder p-4 shadow-card animate-slide-up-delay-5">
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
          <div className={`mt-6 rounded-elder p-4 border animate-slide-up-delay-5 ${criticalCount > 0 ? 'bg-destructive/10 border-destructive/30' : 'bg-destructive/5 border-destructive/20'}`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className={`w-5 h-5 ${criticalCount > 0 ? 'text-destructive animate-pulse' : 'text-destructive'}`} />
              <span className="font-bold text-foreground">{t('Active Alerts', 'सक्रिय अलर्ट')}: {alertCount}</span>
            </div>
            <p className="text-sm text-muted-foreground font-semibold mt-1">
              {criticalCount > 0
                ? t(`${criticalCount} critical alert requires attention`, `${criticalCount} गंभीर अलर्ट पर ध्यान दें`)
                : t('No critical alerts', 'कोई गंभीर अलर्ट नहीं')
              }
            </p>
          </div>
        </>
      )}
    </CaregiverLayout>
  );
};

export default Overview;
