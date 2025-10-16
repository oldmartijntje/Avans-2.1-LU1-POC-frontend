import { useState } from 'react'
import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home.tsx";
import './App.css'
import About from './pages/About';

function App() {
    const [count, setCount] = useState(0)

    return (
        <div>
            <nav className="p-4 border-b mb-6">
                <Link to="/" className="mr-4">Home</Link>
                <Link to="/about">About</Link>
            </nav>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
            </Routes>
        </div>
    );
}

export default App
