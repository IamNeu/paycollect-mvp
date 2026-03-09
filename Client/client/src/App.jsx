import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Requests from './pages/Requests.jsx'
import NewRequest from './pages/NewRequest.jsx'
import RequestDetail from './pages/RequestDetail.jsx'


function App() {
  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/requests" element={<Requests />} />
                <Route path="/requests/new" element={<NewRequest />} />
                <Route path="/requests/:id" element={<RequestDetail />} />


      </Routes>

    </Router>
  )
}

export default App