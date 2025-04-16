import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { registerUser } from "../../util";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const user = await registerUser({
        email: email,
        password,
        firstName: name,
      });
      alert(`Welcome ${user.firstName}`);
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
        label="Name"
        fullWidth
        margin="normal"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextField
        label="Email"
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
