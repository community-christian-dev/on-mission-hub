"use client";

import React, { useState, useEffect } from "react";
import { Calendar, BookOpen, Save, Sparkles, Clock, X, AlertCircle, CheckCircle } from "lucide-react";
import CalendarView from "../components/Admin/CalendarView";
import RichTextEditor from "../components/Admin/RichTextEditor";
import ContentQueue from "../components/Admin/ContentQueue";
import { useReadings, useSaveReading, Reading } from "../hooks/useReadings";
import {
  useMonthlyActions,
  useSaveMonthlyAction,
  MonthlyAction,
} from "../hooks/useMonthlyActions";
import { validateScriptureReference, parseScriptureReference } from "../utils/scriptureUtils";

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<"readings" | "actions">(
    "readings"
  );

  // Date override for testing
  const [dateOverride, setDateOverride] = useState<string>("");
  const [showDateOverride, setShowDateOverride] = useState(false);

  // Load date override from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("dateOverride");
    if (saved) {
      setDateOverride(saved);
      setShowDateOverride(true);
    }
  }, []);

  const handleDateOverrideChange = (value: string) => {
    setDateOverride(value);
    if (value) {
      localStorage.setItem("dateOverride", value);
      // Trigger storage event for other components
      window.dispatchEvent(new StorageEvent("storage", { key: "dateOverride" }));
    } else {
      localStorage.removeItem("dateOverride");
      window.dispatchEvent(new StorageEvent("storage", { key: "dateOverride" }));
    }
  };

  const clearDateOverride = () => {
    setDateOverride("");
    localStorage.removeItem("dateOverride");
    window.dispatchEvent(new StorageEvent("storage", { key: "dateOverride" }));
    setShowDateOverride(false);
  };

  // Get current date (with override for testing)
  const getCurrentDate = () => {
    if (dateOverride) {
      return new Date(dateOverride);
    }
    return new Date();
  };

  // Readings state
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [reference, setReference] = useState("");
  const [referenceError, setReferenceError] = useState<string | null>(null);
  const [referenceValid, setReferenceValid] = useState(false);

  // Monthly actions state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [actionTitle, setActionTitle] = useState("");
  const [actionContent, setActionContent] = useState("");
  const [releaseDate, setReleaseDate] = useState(new Date().toISOString().split('T')[0]);

  // Hooks
  const { data: readings = [], isLoading: readingsLoading } = useReadings();
  const { data: monthlyActions = [], isLoading: actionsLoading } =
    useMonthlyActions();
  const saveReading = useSaveReading();
  const saveAction = useSaveMonthlyAction();

  // Load reading when date is selected
  useEffect(() => {
    if (selectedDate) {
      const reading = readings.find((r) => r.id === selectedDate);
      setReference(reading?.reference || "");
      setReferenceError(null);
      setReferenceValid(false);
    }
  }, [selectedDate, readings]);

  // Validate reference as user types
  useEffect(() => {
    if (!reference.trim()) {
      setReferenceError(null);
      setReferenceValid(false);
      return;
    }

    const validation = validateScriptureReference(reference);
    if (validation.valid) {
      setReferenceError(null);
      setReferenceValid(true);
    } else {
      setReferenceError(validation.error || "Invalid reference");
      setReferenceValid(false);
    }
  }, [reference]);

  // Load monthly action when month/year changes
  useEffect(() => {
    const actionId = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}`;
    const action = monthlyActions.find((a) => a.id === actionId);
    setActionTitle(action?.title || "");
    setActionContent(action?.content || "");
  }, [selectedMonth, selectedYear, monthlyActions]);

  const handleSaveReading = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !reference.trim()) {
      alert("Please select a date and enter a scripture reference");
      return;
    }

    // Validate and convert reference
    const validation = validateScriptureReference(reference);
    if (!validation.valid) {
      alert(validation.error || "Invalid scripture reference");
      return;
    }

    try {
      // Save the API-formatted reference (e.g., "MAT.2" or "JHN.3.16")
      await saveReading.mutateAsync({
        date: selectedDate,
        reference: validation.parsed!.formatted
      });
      alert(`Reading saved: ${validation.parsed!.display}`);
    } catch (error) {
      alert("Failed to save reading");
      console.error(error);
    }
  };

  const handleSaveAction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actionTitle.trim() || !actionContent.trim()) {
      alert("Please enter a title and content");
      return;
    }

    try {
      await saveAction.mutateAsync({
        month: selectedMonth,
        year: selectedYear,
        title: actionTitle,
        content: actionContent,
        releaseDate: new Date(releaseDate),
      });
      alert("Monthly action saved successfully!");
    } catch (error) {
      alert("Failed to save monthly action");
      console.error(error);
    }
  };

  const handleEditReading = (reading: Reading) => {
    setActiveTab("readings");
    setSelectedDate(reading.id);
  };

  const handleEditAction = (action: MonthlyAction) => {
    setActiveTab("actions");
    setSelectedMonth(action.month);
    setSelectedYear(action.year);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-200 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Sparkles className="text-sky-500" />
                Admin Dashboard
              </h1>
              <p className="text-zinc-400">
                Manage daily scripture readings and monthly actions
              </p>
            </div>

            {/* Date Override Toggle */}
            <button
              onClick={() => setShowDateOverride(!showDateOverride)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${dateOverride
                ? "bg-amber-600/20 text-amber-400 border border-amber-600/50"
                : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:border-zinc-600"
                }`}
            >
              <Clock size={18} />
              {dateOverride ? "Testing Mode" : "Set Test Date"}
            </button>
          </div>

          {/* Date Override Input */}
          {showDateOverride && (
            <div className="mt-4 bg-amber-600/10 border border-amber-600/30 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="block text-sm text-amber-400 mb-2">
                    Override Current Date (for testing)
                  </label>
                  <input
                    type="date"
                    value={dateOverride}
                    onChange={(e) => handleDateOverrideChange(e.target.value)}
                    className="w-full p-2 rounded bg-zinc-900 border border-zinc-700 text-white focus:border-amber-500 outline-none"
                  />
                </div>
                <button
                  onClick={clearDateOverride}
                  className="mt-6 p-2 text-amber-400 hover:text-amber-300 hover:bg-zinc-800 rounded transition-colors"
                  title="Clear override"
                >
                  <X size={20} />
                </button>
              </div>
              {dateOverride && (
                <p className="text-xs text-amber-400/70 mt-2">
                  System will behave as if today is{" "}
                  {new Date(dateOverride).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-zinc-800">
          <button
            onClick={() => setActiveTab("readings")}
            className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === "readings"
              ? "text-sky-400"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              Daily Readings
            </div>
            {activeTab === "readings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab("actions")}
            className={`px-6 py-3 font-semibold transition-colors relative ${activeTab === "actions"
              ? "text-purple-400"
              : "text-zinc-500 hover:text-zinc-300"
              }`}
          >
            <div className="flex items-center gap-2">
              <Calendar size={18} />
              Monthly Actions
            </div>
            {activeTab === "actions" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === "readings" ? (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Calendar */}
            <div className="lg:col-span-2">
              <CalendarView
                readings={readings}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            </div>

            {/* Right: Form + Queue */}
            <div className="space-y-6">
              {/* Reading Form */}
              <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">
                  {selectedDate ? "Edit Reading" : "Select a Date"}
                </h2>
                <form onSubmit={handleSaveReading} className="space-y-4">
                  {selectedDate && (
                    <div className="bg-zinc-900 p-3 rounded-lg">
                      <p className="text-sm text-zinc-400 mb-1">Selected Date</p>
                      <p className="text-white font-semibold">
                        {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Scripture Reference
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="e.g. Matthew 2 or John 3:16"
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        disabled={!selectedDate}
                        className={`w-full p-3 pr-10 rounded-lg bg-zinc-900 border text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${!reference.trim()
                          ? "border-zinc-700 focus:border-sky-500"
                          : referenceValid
                            ? "border-green-600 focus:border-green-500"
                            : "border-red-600 focus:border-red-500"
                          }`}
                      />
                      {reference.trim() && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {referenceValid ? (
                            <CheckCircle size={20} className="text-green-500" />
                          ) : (
                            <AlertCircle size={20} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                    {referenceError && (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                        <AlertCircle size={12} />
                        {referenceError}
                      </p>
                    )}
                    {referenceValid && reference.trim() && (
                      <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                        <CheckCircle size={12} />
                        Will be saved as: {parseScriptureReference(reference)?.display}
                      </p>
                    )}
                    <p className="text-xs text-zinc-500 mt-1">
                      Examples: "Matthew 2", "John 3:16", "Romans 12:1-2"
                    </p>
                  </div>
                  <button
                    type="submit"
                    disabled={!selectedDate || saveReading.isPending}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white font-bold p-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Save size={18} />
                    {saveReading.isPending ? "Saving..." : "Save Reading"}
                  </button>
                </form>
              </div>

              {/* Queue */}
              <ContentQueue
                readings={readings}
                monthlyActions={monthlyActions}
                onEditReading={handleEditReading}
                onEditAction={handleEditAction}
                currentDate={getCurrentDate()}
              />
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Editor */}
            <div className="lg:col-span-2">
              <div className="bg-zinc-800 p-6 rounded-2xl border border-zinc-700">
                <h2 className="text-xl font-bold text-white mb-4">
                  Monthly Action Editor
                </h2>
                <form onSubmit={handleSaveAction} className="space-y-4">
                  {/* Month/Year Selector */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Target Month
                      </label>
                      <select
                        value={selectedMonth}
                        onChange={(e) => {
                          const m = parseInt(e.target.value);
                          setSelectedMonth(m);
                          // Default release date to 1st of new month
                          const d = new Date(selectedYear, m - 1, 1);
                          setReleaseDate(d.toISOString().split("T")[0]);
                        }}
                        className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                      >
                        {[
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
                        ].map((month, i) => (
                          <option key={month} value={i + 1}>
                            {month}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-400 mb-2">
                        Target Year
                      </label>
                      <input
                        type="number"
                        value={selectedYear}
                        onChange={(e) => {
                          const y = parseInt(e.target.value);
                          setSelectedYear(y);
                          // Default release date to 1st of new year
                          const d = new Date(y, selectedMonth - 1, 1);
                          setReleaseDate(d.toISOString().split("T")[0]);
                        }}
                        className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                      />
                    </div>
                  </div>

                  {/* Release Date */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Specific Release Date
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        value={releaseDate}
                        onChange={(e) => setReleaseDate(e.target.value)}
                        className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-purple-500 outline-none pl-10"
                      />
                      <Calendar
                        size={18}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 mt-1">
                      Exact date this action becomes active (default is 1st of month)
                    </p>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Prayer of Invitation"
                      value={actionTitle}
                      onChange={(e) => setActionTitle(e.target.value)}
                      className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 text-white focus:border-purple-500 outline-none"
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm text-zinc-400 mb-2">
                      Content
                    </label>
                    <RichTextEditor
                      value={actionContent}
                      onChange={setActionContent}
                      placeholder="Write your monthly action content here..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saveAction.isPending}
                    className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold p-3 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Save size={18} />
                    {saveAction.isPending ? "Saving..." : "Save Monthly Action"}
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Queue */}
            <div>
              <ContentQueue
                readings={readings}
                monthlyActions={monthlyActions}
                onEditReading={handleEditReading}
                onEditAction={handleEditAction}
                currentDate={getCurrentDate()}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
