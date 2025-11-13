/**
 * Dashboard Page
 */

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          FlowDistributor Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatsCard
            title="Active Workflows"
            value="12"
            trend="+2 from last week"
            color="blue"
          />
          <StatsCard
            title="Pending Tasks"
            value="48"
            trend="-5 from yesterday"
            color="yellow"
          />
          <StatsCard
            title="Completed Today"
            value="23"
            trend="+8 from yesterday"
            color="green"
          />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4">Recent Workflows</h2>
          <p className="text-gray-600">
            Your workflows will appear here once you create them.
          </p>
        </div>
      </div>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: string
  trend: string
  color: 'blue' | 'yellow' | 'green'
}

function StatsCard({ title, value, trend, color }: StatsCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    green: 'bg-green-50 text-green-700',
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
      <p className={`text-sm ${colorClasses[color]} px-2 py-1 rounded inline-block`}>
        {trend}
      </p>
    </div>
  )
}
