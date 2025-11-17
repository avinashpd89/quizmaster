import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { IconUserCircle } from "@tabler/icons-react";

export default function ModernUserDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [selectedRange, setSelectedRange] = useState("1day");
  const [loading, setLoading] = useState(true);

  // Range selections
  const rangeOptions = [
    { ui: "1 Day", value: "1day" },
    { ui: "1 Week", value: "1week" },
    { ui: "1 Month", value: "1month" },
    { ui: "3 Months", value: "3month" },
    { ui: "6 Months", value: "6month" },
  ];

  // API CALL
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://44.222.203.3:8000/get_user_dashboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "user123", // Replace with logged-in user
          dashboardPeriod: selectedRange,
        }),
      });

      const data = await response.json();
      setDashboardData(data);
    } catch (err) {
      console.error("Error fetching dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when the page loads & when range changes
  useEffect(() => {
    fetchDashboard();
  }, [selectedRange]);

  if (loading || !dashboardData) {
    return (
      <div className="flex justify-center items-center h-screen text-xl font-semibold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 p-4 bg-white shadow rounded-xl">
        <h1 className="text-2xl font-bold">📊 Quiz Dashboard</h1>
        <div className="flex items-center gap-4">
          <IconUserCircle size={40} className="text-gray-700" />
          <button className="bg-pink-500 text-white px-4 py-1 rounded-lg text-sm">
            Logout
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="bg-white shadow rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-center">
        <span className="font-semibold">Select Range:</span>

        <div className="flex gap-3 flex-wrap">
          {rangeOptions.map((range) => (
            <button
              key={range.value}
              onClick={() => setSelectedRange(range.value)}
              className={`px-4 py-1 rounded-full border ${
                selectedRange === range.value
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {range.ui}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Quiz Attempted" value={dashboardData?.totalQuiz ?? dashboardData?.total_quiz ?? "-"} />
        <StatCard title="Correct Answers" value={dashboardData?.correctAnswers ?? dashboardData?.CorrectAnswers ?? "-"} />
        <StatCard title="Wrong Answers" value={dashboardData?.wrongAnswers ?? dashboardData?.WrongAnswers ?? "-"} />
        <StatCard title="Accuracy" value={`${dashboardData?.accuracy ?? dashboardData?.Accuracy ?? 0}%`} />
        <StatCard title="Passed Quiz" value={dashboardData?.passedQuiz ?? dashboardData?.passed_quiz ?? "-"} />
        <StatCard title="Failed Quiz" value={dashboardData?.failedQuiz ?? dashboardData?.failed_quiz ?? "-"} />
        <StatCard
          title="Total Time Spent"
          value={`${Math.floor((dashboardData?.timeSpend ?? 0) / 3600)}h ${
            Math.floor(((dashboardData?.timeSpend ?? 0) % 3600) / 60)
          }m`}
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Day Wise Quiz Attempts</h3>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dashboardData.dayWiseAttempts}>
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="quizzes"
                stroke="#ef4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Card Component
function StatCard({ title, value }: { title: string; value: any }) {
  return (
    <div className="p-6 bg-white rounded-xl shadow text-center">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
}
