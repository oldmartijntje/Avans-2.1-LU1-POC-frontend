import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, AnonymousRoute, TeacherRoute } from './components/RouteProtection';
import Navigation from './components/Navigation';
import Home from "./pages/Home";
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Management from './pages/Management';
import TranslationManagement from './pages/TranslationManagement';
import NotFound from './pages/NotFound';
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
                    <Route path="/management" element={
                        <TeacherRoute>
                            <Management />
                        </TeacherRoute>
                    } />
                    <Route path="/translation-management" element={
                        <TeacherRoute>
                            <TranslationManagement />
                        </TeacherRoute>
                    } />

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

export default App
