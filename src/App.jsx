import MainPage from './pages/MainPage/MainPage';
import TestPage from "./pages/TestPage/TestPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/test/:id" element={<TestPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
