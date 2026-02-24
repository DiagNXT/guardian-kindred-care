import { AlertTriangle, Pill, WifiOff, Activity, Heart } from 'lucide-react';
import CaregiverLayout from '@/components/CaregiverLayout';
import { useApp } from '@/context/AppContext';
import { alerts } from '@/data/dummyData';

const severityStyles = {
  critical: 'border-l-4 border-l-destructive bg-destructive/5',
  warning: 'border-l-4 border-l-warning bg-warning/5',
  info: 'border-l-4 border-l-primary bg-accent',
};

const severityIcons = {
  medication: Pill,
  inactivity: Activity,
  distress: Heart,
  offline: WifiOff,
};

const Alerts = () => {
  const { t } = useApp();

  return (
    <CaregiverLayout title={t('Alerts', 'अलर्ट')}>
      <div className="space-y-3">
        {alerts.map((alert, i) => {
          const Icon = severityIcons[alert.type as keyof typeof severityIcons] || AlertTriangle;
          return (
            <div
              key={alert.id}
              className={`rounded-elder p-4 shadow-card ${severityStyles[alert.severity]} animate-slide-up-delay-${Math.min(i + 1, 5)}`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  alert.severity === 'critical' ? 'bg-destructive text-destructive-foreground' :
                  alert.severity === 'warning' ? 'bg-warning text-warning-foreground' :
                  'bg-primary text-primary-foreground'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-foreground text-sm">{t(alert.message, alert.messageHi)}</p>
                  <p className="text-xs text-muted-foreground font-semibold mt-1">{alert.time}</p>
                </div>
                {alert.severity === 'critical' && (
                  <span className="px-2 py-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold pulse-gentle">
                    {t('URGENT', 'तुरंत')}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </CaregiverLayout>
  );
};

export default Alerts;
