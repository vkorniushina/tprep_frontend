import MainPage from './pages/MainPage/MainPage';
import TestPage from "./pages/TestPage/TestPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage/QuizPage.jsx";
import EditTestPage from "./pages/EditTestPage/EditTestPage.jsx";
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import EmailVerification from "./pages/EmailVerification/EmailVerification.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/test/:id" element={<TestPage />} />
                <Route path="/test/:id/quiz" element={<QuizPage />} />
                <Route path="/test/:id/edit" element={<EditTestPage />} />

                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/verify-email" element={<EmailVerification />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
