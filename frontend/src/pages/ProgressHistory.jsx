import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../components/lib/axios";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function ProgressHistory() {
  const { token } = useContext(AuthContext);
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllData();
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

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [sleepRes, habitRes, reflectionRes] = await Promise.all([
        api.get("/sleep", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/habits", { headers: { Authorization: `Bearer ${token}` } }),
        api.get("/reflections", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const sleepData = Array.isArray(sleepRes.data) ? sleepRes.data : sleepRes.data.logs || [];
      const habitData = Array.isArray(habitRes.data) ? habitRes.data : habitRes.data.logs || [];
      const reflectionData = Array.isArray(reflectionRes.data) ? reflectionRes.data : reflectionRes.data.logs || [];

      // Merge all logs by date
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

      setAllLogs(mergedLogs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch history data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
        >
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
              d="M15 19l-7-7 7-7" 
            />
          </svg>
          Back to Progress
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Complete History</h1>
      </div>

      {/* All Historical Logs */}
      <div className="space-y-4">
        {allLogs.length > 0 ? (
          allLogs.map((log) => (
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
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No historical data found</p>
          </div>
        )}
      </div>
    </div>
  );
}
