import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { registerUser } from "./client";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../Profile/reducer";

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const user = await registerUser({
        username,
        password,
        email,
      });
      dispatch(setCurrentUser(user));
      navigate("/profile");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Register
      </Typography>
      <TextField
        label="username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="email"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Confirm Password"
        type="password"
        fullWidth
        margin="normal"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
      />
      <Button
        variant="contained"
        fullWidth
        onClick={handleRegister}
        sx={{ mt: 2 }}
      >
        Register
      </Button>
    </Box>
  );
}
