import Contact from "./components/Contact";
import About from "./components/About";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Quizly from "./components/Quizly/Quizly.jsx";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/AuthProvider";
import Result from "./components/Result/Result";
import Question from "./components/QuestionDisplay/question";
import UserDashBoard from "./components/QuizDashboard/userDashboard.tsx";
import Navbar from "./components/Navbar.jsx";
import Forgot from "./components/Password/ForgotPassword.jsx";
import VerifyEmail from "./components/Password/VerifyEmail.jsx";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute.jsx";
import Banner from "./components/Banner.jsx";
import Footer from "./components/Footer.jsx";


function App() {
  const [authUser, setAuthUser] = useAuth();
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Banner />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<Forgot />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />

          {/* Protected routes */}
          <Route
            path="/quizly"
            element={
              <ProtectedRoute>
                <Quizly />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashBoard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result"
            element={
              <ProtectedRoute>
                <Result />
              </ProtectedRoute>
            }
          />
          <Route
            path="/question"
            element={
              <ProtectedRoute>
                <Question />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
