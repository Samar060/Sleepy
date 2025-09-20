import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/lib/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Progress() {
  const { token } = useContext(AuthContext);
  const [logsByDate, setLogsByDate] = useState([]);
  const [summary, setSummary] = useState({ weekly: {}, monthly: {} });
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  // Helper function to get date in IST timezone
  const getLocalDateString = (dateInput) => {
    const date = new Date(dateInput);
    return new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };

  const fetchData = async () => {
    try {
      const [sleepRes, habitRes, reflectionRes] = await Promise.all([
        api.get("/sleep", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/habits", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/reflections", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const sleepData = Array.isArray(sleepRes.data) ? sleepRes.data : sleepRes.data.logs || [];
      const habitData = Array.isArray(habitRes.data) ? habitRes.data : habitRes.data.logs || [];
      const reflectionData = Array.isArray(reflectionRes.data) ? reflectionRes.data : reflectionRes.data.logs || [];

      // Merge logs by date using IST timezone
      const mapByDate = {};
      sleepData.forEach((s) => {
        const date = getLocalDateString(s.date || s.createdAt);
        mapByDate[date] = { date, sleep: s, habits: {}, reflection: "" };
      });
      habitData.forEach((h) => {
        const date = getLocalDateString(h.date || h.createdAt);
        if (!mapByDate[date]) mapByDate[date] = { date, sleep: null, habits: {}, reflection: "" };
        mapByDate[date].habits = h;
      });
      reflectionData.forEach((r) => {
        const date = getLocalDateString(r.date || r.createdAt);
        if (!mapByDate[date]) mapByDate[date] = { date, sleep: null, habits: {}, reflection: "" };
        mapByDate[date].reflection = r.reflection || r.text || "";
      });

      const mergedLogs = Object.values(mapByDate).sort(
        (a, b) => new Date(b.date.split('/').reverse().join('-')) - new Date(a.date.split('/').reverse().join('-'))
      );

      // Show only last 7 days
      setLogsByDate(mergedLogs.slice(0, 7));
      calculateSummary(sleepData, habitData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch progress data");
    }
  };

  const calculateSummary = (sleeps, habits) => {
    const now = new Date();

    const filterByRange = (days) =>
      sleeps.filter(
        (s) => (now - new Date(s.date || s.createdAt)) / (1000 * 60 * 60 * 24) <= days
      );

    const weeklySleeps = filterByRange(7);
    const monthlySleeps = filterByRange(30);

    const avg = (arr) =>
      arr.length
        ? (arr.reduce((sum, s) => sum + (s.duration || 0), 0) / arr.length).toFixed(1)
        : 0;

    const weeklyHabits = habits.filter(
      (h) => (now - new Date(h.date || h.createdAt)) / (1000 * 60 * 60 * 24) <= 7
    );
    const monthlyHabits = habits.filter(
      (h) => (now - new Date(h.date || h.createdAt)) / (1000 * 60 * 60 * 24) <= 30
    );

    setSummary({
      weekly: { avgSleep: avg(weeklySleeps), habitCount: weeklyHabits.length },
      monthly: { avgSleep: avg(monthlySleeps), habitCount: monthlyHabits.length },
    });
  };

  const handleViewMore = () => {
    navigate("/progress/history");
  };

  return (
    <div className="space-y-8">
      {/* Weekly/Monthly Summary */}
      <div className="p-6 rounded-2xl shadow-md border bg-indigo-50">
        <h2 className="font-bold text-xl text-indigo-900 mb-4">
          Weekly & Monthly Progress
        </h2>
        <div className="grid md:grid-cols-2 gap-6 text-gray-900">
          <div className="p-4 rounded-xl bg-white shadow">
            <h3 className="font-semibold text-lg mb-2">Weekly</h3>
            <p>Average Sleep: {summary.weekly.avgSleep} hrs</p>
            <p>Habit Logs: {summary.weekly.habitCount}</p>
          </div>
          <div className="p-4 rounded-xl bg-white shadow">
            <h3 className="font-semibold text-lg mb-2">Monthly</h3>
            <p>Average Sleep: {summary.monthly.avgSleep} hrs</p>
            <p>Habit Logs: {summary.monthly.habitCount}</p>
          </div>
        </div>
      </div>

      {/* Recent 7 Days */}
      <div className="space-y-4">
        <h2 className="font-bold text-xl text-gray-900 mb-4">
          Recent 7 Days
        </h2>
        {logsByDate.map((log) => (
          <div
            key={log.date}
            className="p-6 rounded-2xl shadow-md border bg-blue-50 text-gray-900"
          >
            <div className="mb-2">
              <h3 className="font-bold text-lg">{log.date}</h3>
            </div>

            {/* Sleep */}
            {log.sleep ? (
              <p className="mb-1">
                🛌 Sleep: {log.sleep.sleepTime} → {log.sleep.wakeTime} ({log.sleep.duration} hrs)
              </p>
            ) : (
              <p className="mb-1 text-gray-500">No sleep logged</p>
            )}

            {/* Habits */}
            {log.habits && Object.keys(log.habits).length > 0 ? (
              <p className="mb-1">
                ✅ Habits:{" "}
                {Object.keys(log.habits)
                  .filter((k) => log.habits[k] === true && !["_id", "user", "date", "__v"].includes(k))
                  .join(", ")}
              </p>
            ) : (
              <p className="mb-1 text-gray-500">No habits logged</p>
            )}

            {/* Reflection */}
            {log.reflection ? (
              <p className="mb-1">💭 Reflection: {log.reflection}</p>
            ) : (
              <p className="mb-1 text-gray-500">No reflection logged</p>
            )}
          </div>
        ))}

        {/* View More Button */}
        <button
          onClick={handleViewMore}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-all duration-200"
        >
          <span className="font-medium">View All History</span>
          <svg 
            className="w-5 h-5" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M19 9l-7 7-7-7" 
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
