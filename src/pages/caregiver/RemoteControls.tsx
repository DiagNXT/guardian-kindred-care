import { Phone, Wifi, RotateCcw, MapPin, Video } from 'lucide-react';
import CaregiverLayout from '@/components/CaregiverLayout';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const RemoteControls = () => {
  const { t } = useApp();

  const controls = [
    { icon: Phone, labelEn: 'Ring Phone', labelHi: 'फ़ोन बजाएं', emoji: '🔔', action: () => toast({ title: t('📱 Phone is ringing...', '📱 फ़ोन बज रहा है...') }) },
    { icon: Wifi, labelEn: 'Check Internet', labelHi: 'इंटरनेट जाँचें', emoji: '🌐', action: () => toast({ title: t('✅ Internet is connected (WiFi)', '✅ इंटरनेट जुड़ा है (WiFi)') }) },
    { icon: RotateCcw, labelEn: 'Restart App', labelHi: 'ऐप रीस्टार्ट करें', emoji: '🔄', action: () => toast({ title: t('🔄 App restart triggered', '🔄 ऐप रीस्टार्ट किया गया') }) },
    { icon: MapPin, labelEn: 'View Last Location', labelHi: 'अंतिम स्थान देखें', emoji: '📍', action: () => toast({ title: t('📍 Location: Home – Sector 15, Noida', '📍 स्थान: घर – सेक्टर 15, नोएडा') }) },
    { icon: Video, labelEn: 'Start Video Call', labelHi: 'वीडियो कॉल शुरू करें', emoji: '📹', action: () => toast({ title: t('📹 Starting video call...', '📹 वीडियो कॉल शुरू हो रहा है...') }) },
  ];

  return (
    <CaregiverLayout title={t('Remote Controls', 'रिमोट नियंत्रण')}>
      <div className="space-y-3">
        {controls.map((ctrl, i) => (
          <button
            key={ctrl.labelEn}
            onClick={ctrl.action}
            className={`w-full bg-card rounded-elder p-5 shadow-card flex items-center gap-4 text-left active:scale-[0.98] transition-all animate-slide-up-delay-${Math.min(i + 1, 5)}`}
          >
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <span className="text-2xl">{ctrl.emoji}</span>
            </div>
            <div>
              <p className="font-bold text-foreground text-base">{t(ctrl.labelEn, ctrl.labelHi)}</p>
              <p className="text-xs text-muted-foreground font-semibold">{t('Tap to execute', 'चलाने के लिए टैप करें')}</p>
            </div>
          </button>
        ))}
      </div>
    </CaregiverLayout>
  );
};

export default RemoteControls;
