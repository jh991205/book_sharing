import { useState } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { Link } from "react-router-dom";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const handleTabSwitch = (tab: "login" | "register") => {
    setActiveTab(tab);
  };

  return (
    <div className="card shadow-sm">
      <div className="card-body container-fluid">
        <div className="d-flex justify-content-center mb-4 gap-3">
          <button
            className={`btn ${
              activeTab === "login" ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => handleTabSwitch("login")}
          >
            Login
          </button>
          <button
            className={`btn ${
              activeTab === "register" ? "btn-success" : "btn-outline-success"
            }`}
            onClick={() => handleTabSwitch("register")}
          >
            Register
          </button>
          <Link to="/profile" className="btn btn-outline-secondary">
            Profile
          </Link>
        </div>

        {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
}
