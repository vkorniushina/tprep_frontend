import MainPage from './pages/MainPage/MainPage';
import TestPage from "./pages/TestPage/TestPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QuizPage from "./pages/QuizPage/QuizPage.jsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/test/:id" element={<TestPage />} />
                <Route path="/test/:id/quiz" element={<QuizPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
