import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MenuIcon from "@mui/icons-material/Menu";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

import { setCurrentUser } from "../../pages/Profile/reducer";
import { logoutUser } from "../../pages/Login/client";

export default function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(setCurrentUser(null));
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navItems = [
    { label: "Home", to: "/" },
    { label: "Search", to: "/search" },
    ...(currentUser ? [{ label: "Profile", to: "/profile" }] : []),
    currentUser
      ? { label: "Logout", action: handleLogout }
      : { label: "Login", to: "/login" },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{ backgroundColor: "#fff", color: "#333" }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Typography
              variant="h4"
              component={RouterLink}
              to="/"
              sx={{
                textDecoration: "none",
                color: "inherit",
                fontWeight: "bold",
                letterSpacing: "2px",
                pl: 2,
                flexGrow: 0,
                "&:hover": {
                  color: "inherit",
                },
              }}
            >
              BookHaven
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 4,
                pr: 2,
                ml: "auto", // ← pushes this Box all the way to the right
                // or, alternatively:
                // flexGrow: 1,
                // justifyContent: 'flex-end',
              }}
            >
              {isMobile ? (
                <>
                  <IconButton
                    edge="end"
                    onClick={() => setDrawerOpen(true)}
                    aria-label="menu"
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Drawer
                    anchor="right"
                    open={drawerOpen}
                    onClose={() => setDrawerOpen(false)}
                  >
                    <List sx={{ width: 200 }}>
                      {navItems.map((item) => (
                        <ListItem key={item.label} disablePadding>
                          {item.to ? (
                            <Button
                              component={RouterLink}
                              to={item.to}
                              onClick={() => setDrawerOpen(false)}
                              sx={{
                                width: "100%",
                                justifyContent: "flex-start",
                                textTransform: "none",
                              }}
                            >
                              {item.label}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => {
                                item.action?.();
                                setDrawerOpen(false);
                              }}
                              sx={{
                                width: "100%",
                                justifyContent: "flex-start",
                                textTransform: "none",
                              }}
                            >
                              {item.label}
                            </Button>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Drawer>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 4, pr: 2 }}>
                  {navItems.map((item) =>
                    item.to ? (
                      <Button
                        key={item.label}
                        component={RouterLink}
                        to={item.to}
                        color="inherit"
                        sx={{
                          textTransform: "none",
                          fontSize: "1rem",
                          "&:hover": {
                            color: "inherit",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    ) : (
                      <Button
                        key={item.label}
                        onClick={item.action}
                        color="inherit"
                        sx={{
                          textTransform: "none",
                          fontSize: "1rem",
                          "&:hover": {
                            color: "inherit",
                          },
                        }}
                      >
                        {item.label}
                      </Button>
                    )
                  )}
                </Box>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <Toolbar />
    </>
  );
}
