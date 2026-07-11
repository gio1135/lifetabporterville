export interface ScheduleItem {
  id: string;
  dayOfWeek: number; // 0 for Sunday, 1 for Monday, etc.
  title: string;
  description?: string;
  time: string;
  crossedOut: boolean;
}

export interface Schedule {
  sundaySchool: boolean;
  items: ScheduleItem[];
}

export const defaultSchedule: Schedule = {
  sundaySchool: true,
  items: [
    {
      id: 'default-sunday-morning',
      dayOfWeek: 0,
      title: 'Morning service',
      time: '10:00 AM',
      crossedOut: false
    },
    {
      id: 'default-sunday-night',
      dayOfWeek: 0,
      title: 'Evening service',
      time: '6:00 PM',
      crossedOut: false
    },
    {
      id: 'default-tuesday-prayer',
      dayOfWeek: 2,
      title: 'Prayer night',
      time: '7:00 PM',
      crossedOut: false
    },
    {
      id: 'default-wednesday-service',
      dayOfWeek: 3,
      title: 'Evening service',
      time: '7:30 PM',
      crossedOut: false
    },
    {
      id: 'default-friday-volleyball',
      dayOfWeek: 5,
      title: 'Family night',
      description: 'at zalud park',
      time: '4:00 PM',
      crossedOut: false
    }
  ]
};

export function getCurrentWeekKey(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d.setDate(diff));
  return `schedule:${monday.toISOString().split('T')[0]}`;
}
