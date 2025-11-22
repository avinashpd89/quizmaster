import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const ProtectedRoute = ({ children }) => {
  const [authUser] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authUser) {
      navigate("/"); // smooth navigation
      setTimeout(() => {
        document.getElementById("my_modal_3")?.showModal();
      }, 50); // gives time for navigation
    }
  }, [authUser, navigate]);

  if (!authUser) return null; // Prevent UI flicker

  return children;
};

export default ProtectedRoute;


