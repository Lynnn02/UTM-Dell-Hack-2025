import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, CircularProgress } from '@mui/material';
import Navbar from './components/Navbar';
import DellAssistant from './components/DellAssistant';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CultureCompliance from './pages/CultureCompliance';
import PerformanceFeedback from './pages/PerformanceFeedback';
import Support from './pages/Support';
import FinalReview from './pages/FinalReview';
import Profile from './pages/Profile';
import PersonalizedGoals from './pages/PersonalizedGoals';
import StudyCompanion from './pages/StudyCompanion';
import TeamDashboard from './pages/TeamDashboard';
import theme from './theme/theme';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          // Fetch user profile data for the Dell Assistant
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            setUserProfile(userDoc.data());
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar user={user} />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/support" element={<Support />} />
          
          {/* Protected Routes - Redirect to login if not authenticated */}
          <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/culture-compliance" element={user ? <CultureCompliance /> : <Navigate to="/login" />} />
          <Route path="/performance-feedback" element={user ? <PerformanceFeedback /> : <Navigate to="/login" />} />
          <Route path="/final-review" element={user ? <FinalReview /> : <Navigate to="/login" />} />
          <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/goals" element={user ? <PersonalizedGoals /> : <Navigate to="/login" />} />
          <Route path="/study-companion" element={user ? <StudyCompanion /> : <Navigate to="/login" />} />
          <Route path="/team-dashboard" element={user ? <TeamDashboard /> : <Navigate to="/login" />} />
        </Routes>
        
        {/* Dell Assistant Chat Widget - Only shown when user is logged in */}
        {user && <DellAssistant userProfile={userProfile} />}
      </Router>
    </ThemeProvider>
  );
}

export default App;
