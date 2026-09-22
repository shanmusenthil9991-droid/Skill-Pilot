import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { StudentProfile } from '../types';

interface AuthContextType {
  token: string | null;
  student: StudentProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, studentData?: any) => Promise<void>;
  logout: () => void;
  refreshStudentProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('skillpilot_token'));
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/student/profile');
      setStudent(res.data);
      localStorage.setItem('skillpilot_student', JSON.stringify(res.data));
    } catch (err) {
      console.error('Failed to load profile:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, [token]);

  const login = async (newToken: string, studentData?: any) => {
    localStorage.setItem('skillpilot_token', newToken);
    setToken(newToken);
    if (studentData) {
      setStudent(studentData);
    }
    await fetchProfile();
  };

  const logout = () => {
    localStorage.removeItem('skillpilot_token');
    localStorage.removeItem('skillpilot_student');
    setToken(null);
    setStudent(null);
  };

  const refreshStudentProfile = async () => {
    await fetchProfile();
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        student,
        isAuthenticated: !!token,
        isLoading,
        login,
        logout,
        refreshStudentProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
