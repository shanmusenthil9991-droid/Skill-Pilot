import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Sidebar } from './components/common/Sidebar';
import { Navbar } from './components/common/Navbar';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { AcademicPerformance } from './pages/AcademicPerformance';
import { ProgrammingSkills } from './pages/ProgrammingSkills';
import { DSAAnalysis } from './pages/DSAAnalysis';
import { OnlineCodingAnalysis } from './pages/OnlineCodingAnalysis';
import { AptitudeAnalysis } from './pages/AptitudeAnalysis';
import { LogicalReasoning } from './pages/LogicalReasoning';
import { VerbalAbility } from './pages/VerbalAbility';
import { CommunicationSkills } from './pages/CommunicationSkills';
import { Projects } from './pages/Projects';
import { Internships } from './pages/Internships';
import { Certifications } from './pages/Certifications';
import { TrainingAnalysis } from './pages/TrainingAnalysis';
import { CareerOpportunities } from './pages/CareerOpportunities';
import { PlacementReadiness } from './pages/PlacementReadiness';
import { SkillGapAnalysis } from './pages/SkillGapAnalysis';
import { Recommendations } from './pages/Recommendations';
import { Settings } from './pages/Settings';
import { Login } from './pages/Login';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';

// Protected Route Guard
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">Loading SkillPilot Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Authenticated Layout Wrapper
const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col pl-64 min-w-0">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const location = useLocation();
  const isAuthPage = ['/login', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Student Cockpit Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Profile />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/academics"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AcademicPerformance />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/programming-skills"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <ProgrammingSkills />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dsa-analysis"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DSAAnalysis />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/online-coding"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <OnlineCodingAnalysis />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/aptitude"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <AptitudeAnalysis />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/logical-reasoning"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <LogicalReasoning />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/verbal-ability"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <VerbalAbility />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/communication"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CommunicationSkills />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/projects"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Projects />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/internships"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Internships />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/certifications"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Certifications />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/training"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <TrainingAnalysis />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/career-opportunities"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <CareerOpportunities />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/placement-readiness"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PlacementReadiness />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/skill-gap"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <SkillGapAnalysis />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/recommendations"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Recommendations />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <Settings />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback to Dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

