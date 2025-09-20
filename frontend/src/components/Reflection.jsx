// Reflection.js
export default function Reflection({ value, setValue }) {
  return (
    <textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Write your thoughts or results..."
      className="w-full p-3 rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-400 bg-white text-gray-700"
      rows={4}
    />
  );
}

