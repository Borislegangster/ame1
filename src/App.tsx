import React from "react";
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/admin/ProtectedRoute";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Services } from "./pages/Services";
import { ServiceDetail } from "./pages/ServiceDetail";
import { Projects } from "./pages/Projects";
import { ProjectDetail } from "./pages/ProjectDetail";
import { Blog } from "./pages/Blog";
import { BlogPost } from "./pages/BlogPost";
import { Contact } from "./pages/Contact";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";
import { Cookies } from "./pages/Cookies";
import { Help } from "./pages/Help";
import { FAQ } from "./pages/FAQ";
import { Login } from './pages/auth/Login';
import { Register } from './pages/auth/Register';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { PasswordReset } from './pages/auth/PasswordReset';
import { Dashboard } from './pages/admin/Dashboard';
import { BlogList } from './pages/admin/blog/BlogList';
import { BlogForm } from './pages/admin/blog/BlogForm';
import { Profile } from './pages/Profile';

export function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col w-full min-h-full">
          <Helmet>
            <html lang="fr" />
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <meta name="theme-color" content="#0a1e37" />
            <link rel="alternate" href="https://www.ame-construction.fr" hrefLang="fr-FR" />
          </Helmet>
          <Routes>
            {/* Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin', 'editor']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog"
              element={
                <ProtectedRoute allowedRoles={['admin', 'editor']}>
                  <BlogList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/new"
              element={
                <ProtectedRoute allowedRoles={['admin', 'editor']}>
                  <BlogForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/blog/edit/:id"
              element={
                <ProtectedRoute allowedRoles={['admin', 'editor']}>
                  <BlogForm />
                </ProtectedRoute>
              }
            />
            
            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <>
                  <Header />
                  <main>
                    <Routes>
                      <Route path="/\" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/services" element={<Services />} />
                      <Route path="/services/:id" element={<ServiceDetail />} />
                      <Route path="/projects" element={<Projects />} />
                      <Route path="/projects/:id" element={<ProjectDetail />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:id" element={<BlogPost />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/terms" element={<Terms />} />
                      <Route path="/privacy" element={<Privacy />} />
                      <Route path="/cookies" element={<Cookies />} />
                      <Route path="/help" element={<Help />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/register" element={<Register />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<PasswordReset />} />
                      <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </main>
                  <Footer />
                </>
              }
            />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </AuthProvider>
    </Router>
  );
}