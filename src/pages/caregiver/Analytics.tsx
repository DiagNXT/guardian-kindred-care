import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import CaregiverLayout from '@/components/CaregiverLayout';
import { useApp } from '@/context/AppContext';
import { weeklyAdherence, moodTrend, caregiverOverview } from '@/data/dummyData';

const moodLabels: Record<number, string> = { 1: '😟', 2: '🙂', 3: '😊' };

const Analytics = () => {
  const { t } = useApp();

  const avgAdherence = Math.round(weeklyAdherence.reduce((a, b) => a + b.adherence, 0) / weeklyAdherence.length);

  return (
    <CaregiverLayout title={t('Weekly Analytics', 'साप्ताहिक विश्लेषण')}>
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-3 animate-slide-up">
          <div className="bg-card rounded-elder p-3 shadow-card text-center">
            <p className="text-2xl font-black text-primary">{avgAdherence}%</p>
            <p className="text-xs font-bold text-muted-foreground">{t('Adherence', 'पालन')}</p>
          </div>
          <div className="bg-card rounded-elder p-3 shadow-card text-center">
            <p className="text-2xl font-black text-secondary">🙂</p>
            <p className="text-xs font-bold text-muted-foreground">{t('Avg Mood', 'औसत मूड')}</p>
          </div>
          <div className="bg-card rounded-elder p-3 shadow-card text-center">
            <p className="text-2xl font-black text-destructive">{caregiverOverview.weeklyAlertCount}</p>
            <p className="text-xs font-bold text-muted-foreground">{t('Alerts', 'अलर्ट')}</p>
          </div>
        </div>

        {/* Medication Adherence Chart */}
        <div className="bg-card rounded-elder p-5 shadow-card animate-slide-up-delay-1">
          <h3 className="font-bold text-foreground mb-4">{t('Medication Adherence %', 'दवाई पालन %')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyAdherence}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="adherence" fill="hsl(173, 58%, 39%)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Mood Trend Chart */}
        <div className="bg-card rounded-elder p-5 shadow-card animate-slide-up-delay-2">
          <h3 className="font-bold text-foreground mb-4">{t('Mood Trend', 'मूड का रुझान')}</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={moodTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 88%)" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fontWeight: 700 }} />
              <YAxis domain={[0, 3]} ticks={[1, 2, 3]} tickFormatter={(v) => moodLabels[v] || ''} tick={{ fontSize: 16 }} />
              <Tooltip formatter={(value: number) => [moodLabels[value] || value, t('Mood', 'मूड')]} />
              <Line type="monotone" dataKey="mood" stroke="hsl(38, 92%, 50%)" strokeWidth={3} dot={{ fill: 'hsl(38, 92%, 50%)', r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </CaregiverLayout>
  );
};

export default Analytics;
