import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth }  from './hooks/useAuth';
import { ThemeProvider }           from './hooks/useTheme';
import { Navbar }                  from './components/layout/Navbar';
import { PageLoader }              from './components/ui';

// Pages
import { LandingPage }        from './pages/LandingPage';
import { LoginPage }          from './pages/LoginPage';
import { RegisterPage }       from './pages/RegisterPage';
import { AuthCallbackPage }   from './pages/AuthCallbackPage';
import { ProfileSetupPage }   from './pages/ProfileSetupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { GeneratorPage }      from './pages/GeneratorPage';
import { HistoryPage }        from './pages/HistoryPage';
import { SettingsPage }       from './pages/SettingsPage';
import { AdminDashboard }     from './pages/admin/AdminDashboard';
import { AdminCourses }       from './pages/admin/AdminCourses';
import { AdminTeachers }      from './pages/admin/AdminTeachers';
import { AdminStudents }      from './pages/admin/AdminStudents';
import { AdminTemplates }     from './pages/admin/AdminTemplates';

/* ── Route guards ─────────────────────────────────────────────────── */

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user)   return <Navigate to="/login" replace />;
  return children;
};

const RequireAdmin = ({ children }) => {
  const { user, profile, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user)   return <Navigate to="/login" replace />;
  if (profile?.role !== 'admin') return <Navigate to="/generator" replace />;
  return children;
};

const GuestOnly = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (user)    return <Navigate to="/generator" replace />;
  return children;
};

/* ── App inner (needs auth context) ──────────────────────────────── */
const AppRoutes = () => (
  <>
    <Navbar />
    <Routes>
      {/* Public */}
      <Route path="/"                element={<LandingPage />} />
      <Route path="/auth/callback"   element={<AuthCallbackPage />} />
      <Route path="/login"           element={<GuestOnly><LoginPage /></GuestOnly>} />
      <Route path="/register"        element={<GuestOnly><RegisterPage /></GuestOnly>} />
      <Route path="/forgot-password" element={<GuestOnly><ForgotPasswordPage /></GuestOnly>} />

      {/* Profile setup (Google OAuth first-time users) */}
      <Route path="/profile-setup" element={<RequireAuth><ProfileSetupPage /></RequireAuth>} />

      {/* Protected — students */}
      <Route path="/generator" element={<RequireAuth><GeneratorPage /></RequireAuth>} />
      <Route path="/history"   element={<RequireAuth><HistoryPage /></RequireAuth>} />
      <Route path="/settings"  element={<RequireAuth><SettingsPage /></RequireAuth>} />

      {/* Protected — admin */}
      <Route path="/admin"            element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
      <Route path="/admin/courses"    element={<RequireAdmin><AdminCourses /></RequireAdmin>} />
      <Route path="/admin/teachers"   element={<RequireAdmin><AdminTeachers /></RequireAdmin>} />
      <Route path="/admin/students"   element={<RequireAdmin><AdminStudents /></RequireAdmin>} />
      <Route path="/admin/templates"  element={<RequireAdmin><AdminTemplates /></RequireAdmin>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                fontFamily: '"DM Sans", sans-serif',
                fontSize: '14px',
                fontWeight: 600,
                borderRadius: '12px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
              },
              success: { iconTheme: { primary: '#1a3a6e', secondary: '#fff' } },
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
