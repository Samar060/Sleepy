import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import api from "../components/lib/axios";

export default function Progress() {
  const { token } = useContext(AuthContext);
  const [sleepLogs, setSleepLogs] = useState([]);
  const [habitLogs, setHabitLogs] = useState([]);
  const [mergedLogs, setMergedLogs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res1 = await api.get("/sleep", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const res2 = await api.get("/habits", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSleepLogs(res1.data);
      setHabitLogs(res2.data);

      // 🔗 Merge by date
      const sleepMap = {};
      res1.data.forEach((s) => {
        const date = new Date(s.date).toLocaleDateString();
        sleepMap[date] = s.duration;
      });

      const merged = res2.data.map((h) => {
        const date = new Date(h.date).toLocaleDateString();
        return {
          date,
          duration: sleepMap[date] || null,
          habits: Object.keys(h)
            .filter(
              (k) =>
                h[k] === true &&
                !["_id", "user", "date", "__v"].includes(k)
            )
            .join(", "),
        };
      });

      setMergedLogs(merged);
    };
    fetchData();
  }, [token]);

  return (
    <div className="space-y-8">
      <h2 className="font-bold text-2xl text-blue-700">Your Progress</h2>

      {/* Sleep Chart */}
      <div className="p-6 rounded-2xl shadow-md border border-blue-100 bg-blue-50">
        <h3 className="font-semibold text-blue-700 mb-4">Sleep Duration Chart</h3>
        <div className="w-full h-80">
          <ResponsiveContainer>
            <LineChart
              data={sleepLogs.map((l) => ({
                date: l.date.split("T")[0],
                duration: l.duration,
              }))}
            >
              <Line type="monotone" dataKey="duration" stroke="#3b82f6" strokeWidth={2} />
              <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />
              <XAxis dataKey="date" stroke="#374151" />
              <YAxis stroke="#374151" />
              <Tooltip />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Habit + Sleep Logs */}
      <div className="p-6 rounded-2xl shadow-md border border-green-100 bg-green-50">
        <h3 className="font-semibold text-green-700 mb-4">Habit & Sleep Logs</h3>
        <ul className="space-y-2">
          {mergedLogs.map((log, i) => (
            <li
              key={i}
              className="p-3 bg-white rounded-lg shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center md:justify-between"
            >
              <span className="font-semibold text-gray-700">{log.date}</span>
              <span className="text-blue-600">🛌 Sleep: {log.duration ? `${log.duration} hrs` : "Not logged"}</span>
              <span className="text-green-600">✅ Habits: {log.habits || "None"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

