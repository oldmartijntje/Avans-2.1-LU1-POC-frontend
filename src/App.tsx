import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, AnonymousRoute, TeacherRoute } from './components/RouteProtection';
import Navigation from './components/Navigation';
import Home from "./pages/Home";
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Dashboard from './pages/Dashboard';
import Management from './pages/Management';
import TranslationManagement from './pages/TranslationManagement';
import SubjectManagement from './pages/SubjectManagement';
import CourseManagement from './pages/CourseManagement';
import SubjectView from './pages/SubjectView';
import SubjectsPage from './pages/SubjectsPage';
import RecommendedSubjectsPage from './pages/RecommendedSubjectsPage';
import FavouriteSubjectsPage from './pages/FavouriteSubjectsPage';
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

                    {/* Logout route - accessible to everyone, handles logout and redirect */}
                    <Route path="/logout" element={<Logout />} />

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
                    <Route path="/subject-management" element={
                        <TeacherRoute>
                            <SubjectManagement />
                        </TeacherRoute>
                    } />
                    <Route path="/course-management" element={
                        <TeacherRoute>
                            <CourseManagement />
                        </TeacherRoute>
                    } />
                    <Route path="/subjects" element={
                        <ProtectedRoute>
                            <SubjectsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/subjects/recommended" element={
                        <ProtectedRoute>
                            <RecommendedSubjectsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/subjects/favourites" element={
                        <ProtectedRoute>
                            <FavouriteSubjectsPage />
                        </ProtectedRoute>
                    } />
                    <Route path="/subject/:uuid" element={
                        <ProtectedRoute>
                            <SubjectView />
                        </ProtectedRoute>
                    } />

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </main>
        </div>
    );
}

export default App
