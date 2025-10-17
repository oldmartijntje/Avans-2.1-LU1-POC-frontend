import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, AnonymousRoute } from './components/RouteProtection';
import Navigation from './components/Navigation';
import Home from "./pages/Home";
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TranslationExample from './pages/TranslationExample';
import './App.css'

function App() {
    return (
        <div className="min-vh-100 bg-dark-custom">
            <Navigation />

            <main className="py-4">
                <Routes>
                    {/* Anonymous routes - accessible to everyone */}
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/translation-example" element={<TranslationExample />} />

                    {/* Auth routes - only accessible when not authenticated */}
                    <Route path="/login" element={
                        <AnonymousRoute>
                            <Login />
                        </AnonymousRoute>
                    } />
                    <Route path="/register" element={
                        <AnonymousRoute>
                            <Register />
                        </AnonymousRoute>
                    } />

                    {/* Protected routes - only accessible when authenticated */}
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}

export default App
