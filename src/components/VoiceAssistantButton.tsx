import { Mic } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { toast } from '@/hooks/use-toast';

const VoiceAssistantButton = () => {
  const { t } = useApp();

  const handleVoice = () => {
    toast({
      title: t('🎙️ Voice Assistant', '🎙️ आवाज़ सहायक'),
      description: t('Listening... Say your command.', 'सुन रहा हूँ... अपना आदेश बोलें।'),
    });
  };

  return (
    <button
      onClick={handleVoice}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full gradient-primary shadow-glow-primary flex items-center justify-center text-primary-foreground pulse-gentle"
      aria-label={t('Voice Assistant', 'आवाज़ सहायक')}
    >
      <Mic className="w-7 h-7" />
    </button>
  );
};

export default VoiceAssistantButton;
