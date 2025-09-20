export default function SleepLog({ sleepTime, wakeTime, setSleepTime, setWakeTime }) {
  return (
    <div className="p-6 rounded-2xl shadow-md border border-blue-200 bg-blue-50">
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
    </div>
  );
}
