import React, { useMemo } from 'react';
import { Journal } from '@/@types/journal';
import EmotionDot from './emotion-dot';
import dayjs from 'dayjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface JournalCalendarProps {
  journals: Journal[];
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
  onDateClick: (date: string) => void;
}

const JournalCalendar: React.FC<JournalCalendarProps> = ({
  journals,
  currentMonth,
  onMonthChange,
  onDateClick,
}) => {
  const journalsByDate = useMemo(() => {
    const map = new Map<string, Journal>();
    journals.forEach((journal) => {
      map.set(journal.date, journal);
    });
    return map;
  }, [journals]);

  const calendarDays = useMemo(() => {
    const start = dayjs(currentMonth).startOf('month');
    const end = dayjs(currentMonth).endOf('month');
    const startDay = start.day();
    const daysInMonth = end.date();

    const days: (Date | null)[] = [];

    // Add empty slots for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(start.year(), start.month(), i));
    }

    return days;
  }, [currentMonth]);

  const handlePrevMonth = () => {
    const prevMonth = dayjs(currentMonth).subtract(1, 'month').toDate();
    onMonthChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = dayjs(currentMonth).add(1, 'month').toDate();
    onMonthChange(nextMonth);
  };

  const isToday = (date: Date) => {
    return dayjs(date).isSame(dayjs(), 'day');
  };

  const handleDateClick = (date: Date) => {
    const dateStr = dayjs(date).format('YYYY-MM-DD');
    onDateClick(dateStr);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <CardTitle className="text-lg">
            {dayjs(currentMonth).format('MMMM YYYY')}
          </CardTitle>
          
          <Button variant="ghost" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-medium text-muted-foreground"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateStr = dayjs(date).format('YYYY-MM-DD');
            const journal = journalsByDate.get(dateStr);
            const today = isToday(date);

            return (
              <button
                key={dateStr}
                onClick={() => handleDateClick(date)}
                className={`
                  aspect-square rounded-lg flex flex-col items-center justify-center
                  transition-colors relative
                  ${today ? 'bg-primary/10 border-2 border-primary' : ''}
                  ${journal ? 'hover:bg-muted' : 'hover:bg-muted/50'}
                `}
              >
                <span
                  className={`text-sm ${
                    today
                      ? 'text-primary font-bold'
                      : 'text-foreground'
                  }`}
                >
                  {date.getDate()}
                </span>
                
                {journal && (
                  <div className="mt-1">
                    <EmotionDot sentiment={journal.analysis?.sentiment} size="sm" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1">
              <EmotionDot sentiment="POSITIVE" size="sm" />
              <span className="text-muted-foreground">Tích cực</span>
            </div>
            <div className="flex items-center gap-1">
              <EmotionDot sentiment="NEUTRAL" size="sm" />
              <span className="text-muted-foreground">Bình thường</span>
            </div>
            <div className="flex items-center gap-1">
              <EmotionDot sentiment="NEGATIVE" size="sm" />
              <span className="text-muted-foreground">Tiêu cực</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JournalCalendar;

