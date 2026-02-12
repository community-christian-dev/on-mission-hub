"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Reading } from "@/app/hooks/useReadings";

interface CalendarViewProps {
    readings: Reading[];
    onDateSelect: (date: string) => void;
    selectedDate: string | null;
}

const CalendarView = ({
    readings,
    onDateSelect,
    selectedDate,
}: CalendarViewProps) => {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const { daysInMonth, startingDayOfWeek, year, month } =
        getDaysInMonth(currentMonth);

    const formatDate = (day: number) => {
        return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    };

    const hasReading = (day: number) => {
        const dateStr = formatDate(day);
        return readings.some((r) => r.id === dateStr);
    };

    const isToday = (day: number) => {
        const today = new Date();
        return (
            today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year
        );
    };

    const isSelected = (day: number) => {
        return selectedDate === formatDate(day);
    };

    const previousMonth = () => {
        setCurrentMonth(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(year, month + 1, 1));
    };

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
        <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                    {monthNames[month]} {year}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={previousMonth}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={nextMonth}
                        className="p-2 hover:bg-zinc-700 rounded-lg transition-colors text-zinc-400 hover:text-white"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            {/* Day names */}
            <div className="grid grid-cols-7 gap-2 mb-2">
                {dayNames.map((day) => (
                    <div
                        key={day}
                        className="text-center text-xs font-semibold text-zinc-500 uppercase py-2"
                    >
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7 gap-2">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="aspect-square" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const hasScheduledReading = hasReading(day);
                    const isTodayDate = isToday(day);
                    const isSelectedDate = isSelected(day);

                    return (
                        <button
                            key={day}
                            onClick={() => onDateSelect(formatDate(day))}
                            className={`
                aspect-square rounded-lg flex flex-col items-center justify-center
                transition-all relative group
                ${isSelectedDate
                                    ? "bg-sky-600 text-white ring-2 ring-sky-400"
                                    : hasScheduledReading
                                        ? "bg-green-600/20 text-green-400 hover:bg-green-600/30"
                                        : "bg-zinc-700/50 text-zinc-400 hover:bg-zinc-700"
                                }
                ${isTodayDate && !isSelectedDate ? "ring-2 ring-zinc-500" : ""}
              `}
                        >
                            <span className="text-sm font-semibold">{day}</span>
                            {hasScheduledReading && (
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1" />
                            )}
                            {!hasScheduledReading && (
                                <Plus
                                    size={12}
                                    className="absolute opacity-0 group-hover:opacity-50 transition-opacity"
                                />
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex gap-4 mt-6 text-xs text-zinc-400">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-green-600/20 border border-green-600/50" />
                    <span>Scheduled</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-zinc-700/50 border border-zinc-600" />
                    <span>Empty</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarView;
