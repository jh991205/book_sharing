import { useState } from "react";
import { TextField, Button, Typography, Box } from "@mui/material";
import { loginUser } from "../../util";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "../Profile/reducer";
import { useSelector } from "react-redux";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  if (currentUser) {
    navigate("/profile");
  }

  const handleLogin = async () => {
    try {
      const user = await loginUser(email, password);
      if (!user) return;
      dispatch(setCurrentUser(user));
      navigate("/profile");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <Box>
      <Typography variant="h5" align="center" gutterBottom>
        Login
      </Typography>
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
      <Button
        variant="contained"
        fullWidth
        onClick={handleLogin}
        sx={{ mt: 2 }}
      >
        Login
      </Button>
    </Box>
  );
}
