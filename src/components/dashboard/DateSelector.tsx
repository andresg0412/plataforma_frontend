import React from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: React.FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const formatDateForDisplay = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const changeDate = (days: number) => {
    const currentDate = new Date(selectedDate);
    currentDate.setDate(currentDate.getDate() + days);
    onDateChange(currentDate.toISOString().split('T')[0]);
  };

  const goToToday = () => {
    const today = new Date().toISOString().split('T')[0];
    onDateChange(today);
  };

  const isToday = selectedDate === new Date().toISOString().split('T')[0];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-tourism-navy" />
          <h3 className="text-lg font-semibold text-tourism-navy">
            Caja del día
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => changeDate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Día anterior"
          >
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          </button>
          
          <div className="flex flex-col items-center min-w-[200px]">
            <span className="text-sm font-medium text-tourism-navy capitalize">
              {formatDateForDisplay(selectedDate)}
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="mt-1 text-xs text-gray-500 border-none bg-transparent cursor-pointer"
            />
          </div>
          
          <button
            onClick={() => changeDate(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Día siguiente"
          >
            <ChevronRight className="h-4 w-4 text-gray-600" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {!isToday && (
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm bg-tourism-teal text-white rounded-lg hover:bg-tourism-teal/90 transition-colors"
            >
              Hoy
            </button>
          )}
          {isToday && (
            <span className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg font-medium">
              Hoy
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateSelector;