/**
 * Workflow Detail Page
 */

import { useParams } from 'react-router-dom'

export default function WorkflowDetail() {
  const { id } = useParams<{ id: string }>()

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Workflow Details
        </h1>

        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-600">
            Workflow ID: {id}
          </p>
          <p className="text-gray-600 mt-4">
            Workflow details will be loaded here.
          </p>
        </div>
      </div>
    </div>
  )
}
