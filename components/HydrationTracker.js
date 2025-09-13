import { Droplet, Settings } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";

// HydrationTracker - Single-file React component (updated)
// Tailwind CSS utility classes are used for styling (no imports needed here).
// External libraries assumed available: recharts, lucide-react.

const STORAGE_KEY = "hydration_tracker_v1";

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10); // YYYY-MM-DD
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error("Failed to load state", e);
    return null;
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

function genId() {
  return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
}

function migrateHistory(rawHistory) {
  // New structure: { date: { total: number, events: [{id, amount, label, time}] } }
  if (!rawHistory) return {};
  const out = {};
  for (const [date, val] of Object.entries(rawHistory)) {
    if (typeof val === "number") {
      out[date] = {
        total: val,
        events:
          val > 0
            ? [
                {
                  id: `import-${date}`,
                  amount: val,
                  label: "Import",
                  time: date,
                },
              ]
            : [],
      };
    } else if (
      val &&
      typeof val === "object" &&
      typeof val.total === "number" &&
      Array.isArray(val.events)
    ) {
      out[date] = val;
    } else {
      // Unknown shape -> try to coerce
      const maybeNumber = Number(val);
      out[date] = {
        total: Number.isFinite(maybeNumber) ? maybeNumber : 0,
        events: [],
      };
    }
  }
  return out;
}

export default function HydrationTracker() {
  // Main state: goal (ml), history: { date: { total, events } }
  const [goal, setGoal] = useState(2000);
  const [history, setHistory] = useState({});
  const [inputMl, setInputMl] = useState(250);
  const [quickOptions] = useState([150, 200, 250, 500]);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const loaded = loadState();
    if (loaded) {
      if (loaded.goal) setGoal(loaded.goal);
      if (loaded.history) setHistory(migrateHistory(loaded.history));
    }
  }, []);

  useEffect(() => {
    saveState({ goal, history });
  }, [goal, history]);

  const today = todayKey();
  const todayEntry = history[today] || { total: 0, events: [] };
  const todayAmount = todayEntry.total || 0;
  const progress = Math.min(100, Math.round((todayAmount / goal) * 100));

  function addEvent(amount, label = "") {
    setHistory((prev) => {
      const next = { ...prev };
      const entry = next[today]
        ? { ...next[today], events: [...next[today].events] }
        : { total: 0, events: [] };

      if (amount < 0) {
        // Don't remove more than exists
        const canRemove = Math.min(Math.abs(amount), entry.total);
        if (canRemove <= 0) return prev; // nothing to remove
        const actualAmount = -canRemove;
        entry.total = Math.max(0, entry.total + actualAmount);
        entry.events.push({
          id: genId(),
          amount: actualAmount,
          label: label || `Usuń ${canRemove} ml`,
          time: new Date().toISOString(),
        });
      } else {
        entry.total = entry.total + amount;
        entry.events.push({
          id: genId(),
          amount,
          label: label || `${amount} ml`,
          time: new Date().toISOString(),
        });
      }

      next[today] = entry;
      return next;
    });
  }

  function addIntake(amount, label) {
    addEvent(Number(amount) || 0, label);
  }

  function addGlass250() {
    addEvent(250, "Szklanka 250 ml");
  }

  function removeGlass250() {
    addEvent(-250, "Usuń szklankę (250 ml)");
  }

  function undoLast() {
    setHistory((prev) => {
      const next = { ...prev };
      const entry = next[today]
        ? { ...next[today], events: [...next[today].events] }
        : null;
      if (!entry || entry.events.length === 0) return prev;
      const last = entry.events[entry.events.length - 1];
      // revert last event
      entry.events = entry.events.slice(0, -1);
      // subtracting the event amount reverts it (works for positive and negative amounts)
      entry.total = Math.max(0, entry.total - last.amount);

      if (entry.events.length === 0 && entry.total === 0) {
        delete next[today];
      } else {
        next[today] = entry;
      }

      return next;
    });
  }

  function resetToday() {
    setHistory((prev) => {
      const next = { ...prev };
      delete next[today];
      return next;
    });
  }

  function setGoalFromInput(e) {
    const v = Number(e.target.value);
    if (!Number.isNaN(v) && v > 0) setGoal(Math.round(v));
  }

  const last7Days = useMemo(() => {
    const out = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = todayKey(d);
      out.push({
        date: key,
        amount: (history[key] && history[key].total) || 0,
      });
    }
    return out;
  }, [history]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-sky-50 p-6 flex items-start justify-center">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6">
        <header className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-sky-100 text-sky-700">
              <Droplet size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-semibold">Hydration Tracker</h1>
              <p className="text-sm text-slate-500">
                Śledź swoje nawodnienie każdego dnia
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-slate-50"
              onClick={() => setShowSettings((s) => !s)}
              title="Ustawienia"
            >
              <Settings size={16} /> Ustawienia
            </button>
          </div>
        </header>

        {/* Progress circle */}
        <div className="mt-6">
          <div className="text-center text-lg font-semibold">
            Dzisiejszy postęp
          </div>
          <div className="flex justify-center mt-2">
            <svg viewBox="0 0 36 36" className="w-32 h-32">
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
                stroke="#0284c7"
                strokeWidth="4"
                strokeDasharray="88"
                strokeDashoffset={88 - progress * 88}
                transform="rotate(-90 18 18)"
                style={{
                  transition: "stroke-dashoffset 0.8s ease-out",
                }}
              />
              <text
                x="18"
                y="20"
                textAnchor="middle"
                fontSize="6"
                fill="#034e7b"
              >
                {Math.round(progress * 100)}%
              </text>
            </svg>
          </div>
        </div>

        {/* History table */}
        <div className="mt-4">
          <h2 className="text-lg font-medium mb-2">Historia</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-sm text-slate-500 border-b">
                  <th className="py-2">Data</th>
                  <th className="py-2">Ilość (ml)</th>
                  <th className="py-2">Udział</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(history)
                  .sort((a, b) => b.localeCompare(a))
                  .map((date) => (
                    <tr key={date} className="border-b hover:bg-slate-50">
                      <td className="py-2 align-top">{date}</td>
                      <td className="py-2 align-top">
                        {history[date].total} ml
                      </td>
                      <td className="py-2 align-top">
                        {Math.round((history[date].total / goal) * 100)}%
                      </td>
                    </tr>
                  ))}
                {Object.keys(history).length === 0 && (
                  <tr>
                    <td colSpan={3} className="py-6 text-center text-slate-400">
                      Brak zapisów — zacznij od dodania pierwszej porcji
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Settings */}
        {showSettings && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Ustawienia</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="text-slate-500"
                >
                  Zamknij
                </button>
              </div>

              <label className="block text-sm text-slate-600 mb-2">
                Dzienne zapotrzebowanie (ml)
              </label>
              <input
                type="number"
                className="w-full p-2 rounded-lg border mb-3"
                defaultValue={goal}
                onBlur={(e) => setGoalFromInput(e)}
              />

              <div className="text-sm text-slate-500 mb-4">
                Porada: typowa wartość to 2000–3000 ml, ale dostosuj do swojej
                wagi i aktywności.
              </div>

              <div className="flex justify-end gap-3">
                <button
                  className="px-4 py-2 rounded-lg border"
                  onClick={() => setShowSettings(false)}
                >
                  Gotowe
                </button>
              </div>
            </div>
          </div>
        )}

        <footer className="mt-6 text-xs text-slate-400">
          <div>
            Uwaga: aplikacja przechowuje dane w pamięci przeglądarki
            (localStorage).
          </div>
        </footer>
      </div>
    </div>
  );
}
