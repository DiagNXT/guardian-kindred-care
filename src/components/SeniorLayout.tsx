import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';
import VoiceAssistantButton from './VoiceAssistantButton';
import LanguageToggle from './LanguageToggle';
import { useApp } from '@/context/AppContext';

interface SeniorLayoutProps {
  children: ReactNode;
  title?: string;
  showBack?: boolean;
}

const SeniorLayout = ({ children, title, showBack = false }: SeniorLayoutProps) => {
  const navigate = useNavigate();
  const { t } = useApp();

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-4 bg-card shadow-card sticky top-0 z-40">
        <div className="flex items-center gap-3">
          {showBack ? (
            <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-muted active:scale-95 transition-all">
              <ArrowLeft className="w-6 h-6 text-foreground" />
            </button>
          ) : (
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
          )}
          <h1 className="text-lg font-extrabold text-foreground truncate">
            {title || t('Digital Guardian', 'डिजिटल गार्डियन')}
          </h1>
        </div>
        <LanguageToggle />
      </header>

      {/* Content */}
      <main className="flex-1 px-5 py-6 pb-24">
        {children}
      </main>

      <VoiceAssistantButton />
    </div>
  );
};

export default SeniorLayout;
