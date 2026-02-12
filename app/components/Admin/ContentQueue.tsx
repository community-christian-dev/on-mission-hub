"use client";
import React from "react";
import { Trash2, Calendar, BookOpen } from "lucide-react";
import { Reading, useDeleteReading } from "@/app/hooks/useReadings";
import {
    MonthlyAction,
    useDeleteMonthlyAction,
} from "@/app/hooks/useMonthlyActions";

interface ContentQueueProps {
    readings: Reading[];
    monthlyActions: MonthlyAction[];
    onEditReading?: (reading: Reading) => void;
    onEditAction?: (action: MonthlyAction) => void;
    currentDate?: Date;
}

const ContentQueue = ({
    readings,
    monthlyActions,
    onEditReading,
    onEditAction,
    currentDate,
}: ContentQueueProps) => {
    const deleteReading = useDeleteReading();
    const deleteAction = useDeleteMonthlyAction();

    // Get upcoming readings (next 30 days)
    const today = currentDate || new Date();
    const thirtyDaysFromNow = new Date(today);
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const upcomingReadings = readings
        .filter((r) => {
            const readingDate = new Date(r.id);
            return readingDate >= today && readingDate <= thirtyDaysFromNow;
        })
        .sort((a, b) => a.id.localeCompare(b.id))
        .slice(0, 10);

    // Get upcoming monthly actions
    const upcomingActions = monthlyActions
        .filter((a) => a.releaseDate >= today)
        .sort((a, b) => a.releaseDate.getTime() - b.releaseDate.getTime())
        .slice(0, 5);

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        });
    };

    const formatMonthYear = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="space-y-6">
            {/* Upcoming Readings */}
            <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <BookOpen size={20} className="text-sky-500" />
                    Upcoming Readings
                </h3>

                {upcomingReadings.length === 0 ? (
                    <p className="text-zinc-500 text-sm">No upcoming readings scheduled</p>
                ) : (
                    <div className="space-y-2">
                        {upcomingReadings.map((reading) => (
                            <div
                                key={reading.id}
                                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg hover:bg-zinc-700/50 transition-colors group"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-zinc-400">
                                            {formatDate(reading.id)}
                                        </span>
                                        <span className="text-white font-medium">
                                            {reading.reference}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {onEditReading && (
                                        <button
                                            onClick={() => onEditReading(reading)}
                                            className="text-sky-400 hover:text-sky-300 text-sm px-3 py-1 rounded hover:bg-zinc-800 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this reading?")) {
                                                deleteReading.mutate(reading.id);
                                            }
                                        }}
                                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-zinc-800 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upcoming Monthly Actions */}
            <div className="bg-zinc-800 rounded-2xl border border-zinc-700 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-purple-500" />
                    Upcoming Monthly Actions
                </h3>

                {upcomingActions.length === 0 ? (
                    <p className="text-zinc-500 text-sm">
                        No upcoming monthly actions scheduled
                    </p>
                ) : (
                    <div className="space-y-2">
                        {upcomingActions.map((action) => (
                            <div
                                key={action.id}
                                className="flex items-center justify-between p-3 bg-zinc-900 rounded-lg hover:bg-zinc-700/50 transition-colors group"
                            >
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-mono text-zinc-400">
                                            {formatDate(action.releaseDate.toISOString())}
                                        </span>
                                        <span className="text-white font-medium">
                                            {action.title}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {onEditAction && (
                                        <button
                                            onClick={() => onEditAction(action)}
                                            className="text-sky-400 hover:text-sky-300 text-sm px-3 py-1 rounded hover:bg-zinc-800 transition-colors"
                                        >
                                            Edit
                                        </button>
                                    )}
                                    <button
                                        onClick={() => {
                                            if (confirm("Delete this monthly action?")) {
                                                deleteAction.mutate(action.id);
                                            }
                                        }}
                                        className="text-red-400 hover:text-red-300 p-1 rounded hover:bg-zinc-800 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ContentQueue;
