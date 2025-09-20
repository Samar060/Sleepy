const habits = [
  { key: "exercise", label: "Exercise in morning" },
  { key: "noCoffee", label: "No coffee after 3pm" },
  { key: "noScreen", label: "Avoid screens 1hr before bed" },
  { key: "readBook", label: "Read a book" },
  { key: "meditation", label: "Mindful meditation" }
];

export default function HabitsLog({ checked, setChecked }) {
  return (
    <div className="p-6 rounded-2xl shadow-md border border-blue-200 bg-blue-50">
      <h2 className="font-bold text-xl text-blue-700 mb-4">Daily Habits</h2>
      <div className="space-y-3">
        {habits.map((h) => (
          <label key={h.key} className="flex items-center space-x-2">
            <input
              type="checkbox"
              className="w-4 h-4 accent-blue-600"
              checked={checked[h.key] || false}
              onChange={(e) =>
                setChecked({ ...checked, [h.key]: e.target.checked })
              }
            />
            <span className="text-gray-700">{h.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
