/**
 * Application Routes
 */

import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

// Lazy load pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const WorkflowList = lazy(() => import('./pages/WorkflowList'))
const WorkflowDetail = lazy(() => import('./pages/WorkflowDetail'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workflows" element={<WorkflowList />} />
        <Route path="/workflows/:id" element={<WorkflowDetail />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  )
}
