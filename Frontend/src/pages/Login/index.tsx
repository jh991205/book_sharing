import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { Box, Button, ButtonGroup, Paper } from "@mui/material";

export default function Login() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, margin: "auto", mt: 6 }}>
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
