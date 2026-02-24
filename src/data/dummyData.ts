export const medicines = [
  { id: 1, name: 'Metformin 500mg', nameHi: 'मेटफॉर्मिन 500mg', time: '8:00 AM', tag: 'After Food', tagHi: 'खाने के बाद', taken: true },
  { id: 2, name: 'Amlodipine 5mg', nameHi: 'एम्लोडिपिन 5mg', time: '8:00 AM', tag: 'Before Food', tagHi: 'खाने से पहले', taken: true },
  { id: 3, name: 'Aspirin 75mg', nameHi: 'एस्पिरिन 75mg', time: '2:00 PM', tag: 'After Food', tagHi: 'खाने के बाद', taken: false },
  { id: 4, name: 'Atorvastatin 10mg', nameHi: 'एटोरवास्टेटिन 10mg', time: '9:00 PM', tag: 'After Food', tagHi: 'खाने के बाद', taken: false },
];

export const weeklyAdherence = [
  { day: 'Mon', adherence: 100 },
  { day: 'Tue', adherence: 75 },
  { day: 'Wed', adherence: 100 },
  { day: 'Thu', adherence: 50 },
  { day: 'Fri', adherence: 100 },
  { day: 'Sat', adherence: 75 },
  { day: 'Sun', adherence: 100 },
];

export const moodTrend = [
  { day: 'Mon', mood: 3 },
  { day: 'Tue', mood: 3 },
  { day: 'Wed', mood: 2 },
  { day: 'Thu', mood: 1 },
  { day: 'Fri', mood: 3 },
  { day: 'Sat', mood: 2 },
  { day: 'Sun', mood: 3 },
];

export const alerts = [
  { id: 1, type: 'medication', message: 'Missed Aspirin 75mg at 2:00 PM', messageHi: 'दोपहर 2:00 बजे एस्पिरिन 75mg छूट गई', time: '2:30 PM', severity: 'warning' as const },
  { id: 2, type: 'inactivity', message: 'No activity detected for 3 hours', messageHi: '3 घंटे से कोई गतिविधि नहीं', time: '11:00 AM', severity: 'info' as const },
  { id: 3, type: 'distress', message: 'Reported feeling unwell – chest area', messageHi: 'अस्वस्थ महसूस किया – छाती क्षेत्र', time: '9:15 AM', severity: 'critical' as const },
  { id: 4, type: 'offline', message: 'Phone went offline for 45 minutes', messageHi: 'फ़ोन 45 मिनट के लिए ऑफ़लाइन हो गया', time: 'Yesterday', severity: 'warning' as const },
];

export const caregiverOverview = {
  medicationAdherence: 75,
  mealsToday: { breakfast: true, lunch: false, dinner: false },
  moodToday: 'Okay',
  moodTodayHi: 'ठीक',
  lastActive: '12 min ago',
  lastActiveHi: '12 मिनट पहले',
  internetStatus: 'Connected',
  internetStatusHi: 'जुड़ा हुआ',
  batteryLevel: 68,
  weeklyAlertCount: 7,
};
