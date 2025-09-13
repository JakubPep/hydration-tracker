import { MinusCircle, PlusCircle, RefreshCw, Settings } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export default function App() {
  const [goal, setGoal] = useState(() => {
    const saved = localStorage.getItem("hydration-goal");
    return saved ? Number(saved) : 2000;
  });
  const today = new Date().toISOString().slice(0, 10);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem("hydration-history");
    return saved ? JSON.parse(saved) : {};
  });

  const todayEntry = history[today] || { amount: 0, events: [] };
  const todayAmount = todayEntry.amount;
  const progress = Math.min(todayAmount / goal, 1);

  useEffect(() => {
    localStorage.setItem("hydration-history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem("hydration-goal", goal);
  }, [goal]);

  const addIntake = (ml) => {
    if (!ml) return;
    const updated = {
      ...history,
      [today]: {
        amount: todayAmount + ml,
        events: [
          ...todayEntry.events,
          {
            id: Date.now(),
            amount: ml,
            label: `Porcja`,
            time: new Date().toISOString(),
          },
        ],
      },
    };
    setHistory(updated);
  };

  const removeGlass250 = () => addIntake(-250);
  const resetToday = () => {
    const updated = { ...history, [today]: { amount: 0, events: [] } };
    setHistory(updated);
  };
  const undoLast = () => {
    if (todayEntry.events.length === 0) return;
    const last = todayEntry.events[todayEntry.events.length - 1];
    const updated = {
      ...history,
      [today]: {
        amount: todayAmount - last.amount,
        events: todayEntry.events.slice(0, -1),
      },
    };
    setHistory(updated);
  };

  const last7Days = Object.entries(history)
    .slice(-7)
    .map(([date, entry]) => ({ date, amount: entry.amount }));

  const [inputMl, setInputMl] = useState(0);
  const quickOptions = [100, 250, 350, 500];

  // Modal ustawień
  const [showSettings, setShowSettings] = useState(false);
  const [newGoal, setNewGoal] = useState(goal);

  const saveGoal = () => {
    setGoal(newGoal);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-6">
      <div className="flex justify-center items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2 mx-3">
          <img src="/water-icon.svg" alt="water" className="w-6 h-6" />
          Hydration Tracker
        </h1>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-lg border dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <Settings size={20} />
        </button>
      </div>

      {/* Top: Progress + Quick Add */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-6">
        {/* Progress circle */}
        <div className="flex flex-col items-center">
          <div className="w-48 h-48 rounded-full flex items-center justify-center bg-sky-50 dark:bg-slate-800">
            <svg viewBox="0 0 36 36" className="w-36 h-36">
              <path
                d="M18 2a16 16 0 1 0 0 32 16 16 0 1 0 0-32Z"
                fill="#e6f6ff"
              />
              <circle
                r="14"
                cx="18"
                cy="18"
                fill="none"
                stroke="#bae6fd"
                strokeWidth="4"
              />
              <circle
                r="14"
                cx="18"
                cy="18"
                fill="none"
                stroke={progress >= 1 ? "#16a34a" : "#0284c7"}
                strokeWidth="4"
                strokeDasharray="88"
                strokeDashoffset={88 - progress * 88}
                transform="rotate(-90 18 18)"
                style={{
                  transition:
                    "stroke-dashoffset 0.8s ease-out, stroke 0.5s ease",
                }}
              />
              <text
                x="18"
                y="20"
                textAnchor="middle"
                fontSize="6"
                fill={progress >= 1 ? "#16a34a" : "#034e7b"}
              >
                {Math.round(progress * 100)}%
              </text>
            </svg>
          </div>
          <div className="mt-3 text-center">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Dziś wypito
            </div>
            <div className="text-xl font-semibold">
              {todayAmount} ml / {goal} ml
            </div>
            <div className="text-xs text-slate-400">
              Średnio: {(todayAmount / 1000).toFixed(2)} L
            </div>
          </div>
        </div>

        {/* Quick Add */}
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-600 dark:text-slate-300">
              Dodaj szybkie porcje
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-3">
            {quickOptions.map((q) => (
              <button
                key={q}
                onClick={() => addIntake(q)}
                className="flex flex-col items-center justify-center w-20 h-20 rounded-xl border shadow bg-gradient-to-b from-sky-100 to-white dark:from-slate-700 dark:to-slate-800"
              >
                <span className="text-base font-semibold">{q}</span>
                <span className="text-xs">ml</span>
              </button>
            ))}

            {/* Remove glass */}
            <button
              onClick={removeGlass250}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-white dark:hover:bg-slate-700"
            >
              <MinusCircle size={16} /> Usuń 250ml
            </button>
          </div>

          <div className="flex gap-3 items-center">
            <input
              type="number"
              className="w-28 p-2 rounded-lg border dark:bg-slate-700"
              value={inputMl}
              onChange={(e) => setInputMl(Number(e.target.value))}
            />
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-sky-600 text-white"
              onClick={() => addIntake(Number(inputMl) || 0)}
            >
              <PlusCircle size={16} /> Dodaj
            </button>
            <button
              className="flex items-center gap-2 px-3 py-2 min-w-400 rounded-lg border"
              onClick={undoLast}
            >
              <RefreshCw size={16} /> Cofnij
            </button>
            <button
              className="px-3 py-2 rounded-lg border text-sm"
              onClick={resetToday}
            >
              Reset
            </button>
          </div>

          {/* Today's events */}
          <div className="mt-4">
            <div className="text-sm text-slate-600 dark:text-slate-200 mb-2">
              Dziś - szczegóły
            </div>
            <div className="text-xs text-slate-500">
              <div className="h-60 overflow-y-auto pr-1 border rounded-md flex flex-col">
                {todayEntry.events.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-slate-400">
                    Brak wpisów dziś
                  </div>
                ) : (
                  <ul className="space-y-1">
                    {todayEntry.events
                      .slice()
                      .reverse()
                      .map((ev) => (
                        <li
                          key={ev.id}
                          className={`flex items-center justify-between border rounded-md p-2 ${
                            ev.amount > 0
                              ? "bg-blue-50 dark:bg-blue-900/30"
                              : "bg-red-50 dark:bg-red-900/30"
                          }`}
                        >
                          <div>
                            <div className="text-sm text-slate-800 dark:text-slate-100">
                              {ev.label}{" "}
                              {ev.amount > 0
                                ? `+${ev.amount} ml`
                                : `${ev.amount} ml`}
                            </div>
                            <div className="text-xs text-slate-400">
                              {new Date(ev.time).toLocaleTimeString()}
                            </div>
                          </div>
                          <div className="text-xs text-slate-400">
                            {ev.amount > 0 ? "dodano" : "odjęto"}
                          </div>
                        </li>
                      ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="mt-4 bg-white dark:bg-slate-800 rounded-lg p-3">
        <div className="text-sm text-slate-600 dark:text-slate-300 mb-2">
          Ostatnie 7 dni
        </div>
        <div style={{ width: "100%", height: 120 }}>
          <ResponsiveContainer>
            <AreaChart data={last7Days}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0284c7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" hide />
              <Tooltip formatter={(value) => `${value} ml`} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#0284c7"
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Modal ustawień */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg w-80">
            <h2 className="text-lg font-semibold mb-4">Ustaw cel dzienny</h2>
            <input
              type="number"
              className="w-full p-2 rounded-lg border dark:bg-slate-700 mb-4"
              value={newGoal}
              onChange={(e) => setNewGoal(Number(e.target.value))}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowSettings(false)}
                className="px-4 py-2 rounded-lg border"
              >
                Anuluj
              </button>
              <button
                onClick={saveGoal}
                className="px-4 py-2 rounded-lg bg-sky-600 text-white"
              >
                Zapisz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
