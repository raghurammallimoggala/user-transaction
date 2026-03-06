import { BrowserRouter as Router, Routes, Route,Navigate } from "react-router-dom";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
function App() {
  return (
    <Router>
        <Routes>
          <Route path="/" element={<Navigate to ="/login" />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/register" element={<UserRegister/>}/>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/forgot-password" element={<ForgotPassword/>}/>
          <Route path="*" element={<p className="text-center mt-10">404 Page Not Found</p>} />
        </Routes>
    </Router>
  )
}

export default App;