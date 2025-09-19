import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import api from "../components/lib/axios";

const habits = [
  { key: "exercise", label: "Exercise in morning" },
  { key: "noCoffee", label: "No coffee after 3pm" },
  { key: "noScreen", label: "Avoid screens 1hr before bed" },
  { key: "readBook", label: "Read a book" },
  { key: "meditation", label: "Mindful meditation" }
];

export default function Dashboard() {
  const { token } = useContext(AuthContext);
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [checked, setChecked] = useState({});

  const saveSleep = async () => {
    if (!sleepTime || !wakeTime) return toast.error("Enter times!");
    const duration =
      (new Date(`1970-01-01T${wakeTime}`) - new Date(`1970-01-01T${sleepTime}`)) /
      (1000 * 60 * 60);
    await api.post(
      "/sleep",
      { sleepTime, wakeTime, duration: duration < 0 ? 24 + duration : duration },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Sleep logged!");
  };

  const saveHabits = async () => {
    await api.post("/habits", checked, {
      headers: { Authorization: `Bearer ${token}` }
    });
    toast.success("Habits saved!");
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      {/* Sleep log card */}
      <div className="p-6 rounded-2xl shadow-md border border-blue-100 bg-blue-50">
        <h2 className="font-bold text-xl text-blue-700 mb-4">Log Sleep</h2>
        <div className="flex items-center gap-3">
          <input
            type="time"
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={sleepTime}
            onChange={(e) => setSleepTime(e.target.value)}
          />
          <span className="text-gray-600">to</span>
          <input
            type="time"
            className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={wakeTime}
            onChange={(e) => setWakeTime(e.target.value)}
          />
        </div>
        <button
          className="mt-4 w-full bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-lg shadow"
          onClick={saveSleep}
        >
          Save Sleep
        </button>
      </div>

      {/* Habits card */}
      <div className="p-6 rounded-2xl shadow-md border border-green-100 bg-green-50">
        <h2 className="font-bold text-xl text-green-700 mb-4">Daily Habits</h2>
        <div className="space-y-3">
          {habits.map((h) => (
            <label key={h.key} className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 accent-green-500"
                checked={checked[h.key] || false}
                onChange={(e) =>
                  setChecked({ ...checked, [h.key]: e.target.checked })
                }
              />
              <span className="text-gray-700">{h.label}</span>
            </label>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-green-500 hover:bg-green-600 transition text-white px-4 py-2 rounded-lg shadow"
          onClick={saveHabits}
        >
          Save Habits
        </button>
      </div>
    </div>
  );
}
