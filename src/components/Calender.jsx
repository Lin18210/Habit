import { useState, useEffect } from "react";
import { useHabits } from "./HabitContext";

const Calendar = () => {
    const { habits } = useHabits();
    const [completedDates, setCompletedDates] = useState({});

    useEffect(() => {
        const dates = {};
        habits.forEach(habit => {
            habit.completedDates.forEach(date => {
                if (!dates[date]) {
                    dates[date] = { total: 0, completed: 0 };
                }
                dates[date].total++;
                dates[date].completed++;
            });
        });
        setCompletedDates(dates);
    }, [habits]);

    const renderCalendar = () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeks = Math.ceil((daysInMonth + startingDay) / 7);

        return (
            <div className="w-full max-w-3xl mx-auto">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {days.map(day => (
                        <div key={day} className="text-center font-medium p-2 text-slate-400">
                            {day}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: weeks * 7 }).map((_, index) => {
                        const day = index - startingDay + 1;
                        const dateStr = day > 0 && day <= daysInMonth
                            ? new Date(today.getFullYear(), today.getMonth(), day)
                                .toISOString()
                                .split('T')[0]
                            : null;
                        
                        const isCompleted = dateStr && 
                            completedDates[dateStr]?.completed === habits.length && 
                            habits.length > 0;

                        const isToday = day === today.getDate();

                        return (
                            <div
                                key={index}
                                className={`aspect-square p-2 border rounded-lg font-medium flex items-center justify-center transition-all ${
                                    day > 0 && day <= daysInMonth
                                        ? isToday
                                            ? 'border-purple-500 shadow-md'
                                            : 'border-slate-700'
                                        : 'bg-transparent border-transparent'
                                } ${
                                    isCompleted
                                        ? 'bg-green-600 text-white shadow-md'
                                        : day > 0 && day <= daysInMonth
                                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-300'
                                            : ''
                                }`}
                            >
                                <div className="flex items-center justify-center">
                                    {day > 0 && day <= daysInMonth ? day : ''}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-6 text-center text-slate-100">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            {renderCalendar()}
            <div className="mt-6 text-center text-slate-500 text-sm">
                <p>Purple days indicate all tasks were completed</p>
            </div>
        </div>
    );
};

export default Calendar;