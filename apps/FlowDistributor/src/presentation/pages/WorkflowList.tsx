/**
 * Workflow List Page
 */

export default function WorkflowList() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Workflows</h1>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
            + New Workflow
          </button>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <p className="text-gray-600 text-center py-12">
              No workflows yet. Click "New Workflow" to create your first one.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
