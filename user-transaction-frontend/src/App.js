import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UserRegister from "./components/UserRegister";
import UserLogin from "./components/UserLogin";
import Dashboard from "./components/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/login" }) }), _jsx(Route, { path: "/login", element: _jsx(UserLogin, {}) }), _jsx(Route, { path: "/register", element: _jsx(UserRegister, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/forgot-password", element: _jsx(ForgotPassword, {}) }), _jsx(Route, { path: "*", element: _jsx("p", { className: "text-center mt-10", children: "404 Page Not Found" }) })] }) }));
}
export default App;
//# sourceMappingURL=App.js.map