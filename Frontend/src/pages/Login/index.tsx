import { useState } from "react";
import LoginForm from "./loginForm";
import RegisterForm from "./registerForm";
import { Box, Button, ButtonGroup, Paper } from "@mui/material";
import Navigation from "../../components/Navigation";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  if (currentUser) {
    navigate("/profile");
  }

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, margin: "auto", mt: 6 }}>
      <Navigation />
      <Box display="flex" justifyContent="center" gap={2} mb={3}>
        <ButtonGroup fullWidth>
          <Button
            variant={activeTab === "login" ? "contained" : "outlined"}
            onClick={() => setActiveTab("login")}
          >
            Login
          </Button>
          <Button
            variant={activeTab === "register" ? "contained" : "outlined"}
            onClick={() => setActiveTab("register")}
          >
            Register
          </Button>
        </ButtonGroup>
      </Box>
      {activeTab === "login" ? <LoginForm /> : <RegisterForm />}
    </Paper>
  );
}
