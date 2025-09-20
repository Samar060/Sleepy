import { useState, useContext } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import api from "../components/lib/axios";
import Reflection from "../components/Reflection";

const habitsList = [
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
  const [reflection, setReflection] = useState("");

  const handleSaveAll = async () => {
    if (!sleepTime && !wakeTime && !Object.values(checked).some(Boolean) && !reflection) {
      return toast.error("Cannot save empty log!");
    }

    try {
      // Save sleep if entered
      if (sleepTime && wakeTime) {
        const duration =
          (new Date(`1970-01-01T${wakeTime}`) - new Date(`1970-01-01T${sleepTime}`)) /
          (1000 * 60 * 60);
        await api.post(
          "/sleep",
          { sleepTime, wakeTime, duration: duration < 0 ? 24 + duration : duration },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Save habits if any checked
      if (Object.values(checked).some(Boolean)) {
        await api.post(
          "/habits",
          checked,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Save reflection if entered
      if (reflection) {
        await api.post(
          "/reflections",
          { reflection },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      toast.success("All logs saved successfully!");
      setSleepTime("");
      setWakeTime("");
      setChecked({});
      setReflection("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save logs");
    }
  };

  // Responsive styling classes
  const cardBaseStyle = "p-4 sm:p-6 rounded-2xl shadow-md border bg-green-50 border-green-200";
  const headingStyle = "font-bold text-lg sm:text-xl text-green-700 mb-3";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Grid container for responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Sleep log - Full width on mobile, spans 2 cols on xl screens */}
        <div className={`${cardBaseStyle} lg:col-span-2 xl:col-span-2`}>
          <h2 className={headingStyle}>Log Sleep</h2>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="time"
              className="border p-2 sm:p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
            />
            <span className="text-gray-600 text-sm sm:text-base px-2">to</span>
            <input
              type="time"
              className="border p-2 sm:p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
            />
          </div>
        </div>

        {/* Habits - Takes remaining space */}
        <div className={`${cardBaseStyle} lg:col-span-2 xl:col-span-1`}>
          <h2 className={headingStyle}>Daily Habits</h2>
          <div className="space-y-2 sm:space-y-3">
            {habitsList.map((h) => (
              <label key={h.key} className="flex items-center gap-2 sm:gap-3">
                <input
                  type="checkbox"
                  checked={checked[h.key] || false}
                  onChange={(e) =>
                    setChecked({ ...checked, [h.key]: e.target.checked })
                  }
                  className="w-4 h-4 sm:w-5 sm:h-5 accent-green-500 flex-shrink-0"
                />
                <span className="text-gray-700 text-sm sm:text-base leading-relaxed">
                  {h.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Reflection - Full width across all screen sizes */}
        <div className={`${cardBaseStyle} lg:col-span-2 xl:col-span-3`}>
          <h2 className={headingStyle}>Reflection</h2>
          <Reflection value={reflection} setValue={setReflection} />
        </div>
      </div>

      {/* Save All Button - Full width with responsive padding */}
      <div className="mt-4 sm:mt-6">
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 sm:py-4 rounded-lg shadow-md transition text-sm sm:text-base font-medium"
          onClick={handleSaveAll}
        >
          Save All
        </button>
      </div>
    </div>
  );
}
