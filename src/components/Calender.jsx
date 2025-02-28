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
                            <div key={day} className="text-center font-semibold p-2">
                                {day}
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 gap-1">
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

                        return (
                            <div
                                key={index}
                                className={`aspect-square p-2 border rounded-3xl font-bold ${
                                    day > 0 && day <= daysInMonth
                                        ? isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'bg-white'
                                        : 'bg-gray-100'
                                }`}
                            >
                                <div className="h-full flex items-center justify-center">
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
            <h2 className="text-xl font-bold mb-4 text-center">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            {renderCalendar()}
        </div>
    );
};

export default Calendar;