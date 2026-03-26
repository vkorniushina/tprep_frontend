import MainPage from './pages/MainPage/MainPage';
import TestPage from "./pages/TestPage/TestPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage/QuizPage.jsx";
import EditTestPage from "./pages/EditTestPage/EditTestPage.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute/PublicRoute.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={
                    <ProtectedRoute><MainPage /></ProtectedRoute>
                } />
                <Route path="/test/:id" element={
                    <ProtectedRoute><TestPage /></ProtectedRoute>
                } />
                <Route path="/test/:id/quiz" element={
                    <ProtectedRoute><QuizPage /></ProtectedRoute>
                } />
                <Route path="/test/:id/edit" element={
                    <ProtectedRoute><EditTestPage /></ProtectedRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute><Register /></PublicRoute>
                } />
                <Route path="/login" element={
                    <PublicRoute><Login /></PublicRoute>
                } />
                <Route path="/verify-email" element={<EmailVerification />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
