import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Requests from './pages/Requests.jsx'
import NewRequest from './pages/NewRequest.jsx'
import RequestDetail from './pages/RequestDetail.jsx'
import Customers from './pages/Customers.jsx'
import AddCustomer from './pages/AddCustomer.jsx'
import CustomerProfile from './pages/CustomerProfile.jsx'
import Settings from './pages/Settings.jsx'
import Reports from './pages/Reports.jsx'
import PaymentPage from './pages/PaymentPage.jsx'

function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        {/* Public */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/pay/:token" element={<PaymentPage />} />

        {/* Protected */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/requests" element={<ProtectedRoute><Requests /></ProtectedRoute>} />
        <Route path="/requests/new" element={<ProtectedRoute><NewRequest /></ProtectedRoute>} />
        <Route path="/requests/:id" element={<ProtectedRoute><RequestDetail /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path="/customers/new" element={<ProtectedRoute><AddCustomer /></ProtectedRoute>} />
        <Route path="/customers/:id" element={<ProtectedRoute><CustomerProfile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App