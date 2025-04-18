import { useEffect, useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Navigation from "../../components/Navigation";
import {
  getAllUsers,
  getAllBooks,
  getAllReviews,
  deleteUserById,
  deleteBookById,
  deleteReviewById,
  deleteReviewsByUser,
  deleteTagsByUser,
  deleteCollectionsByUser,
  deleteTagsByReview,
} from "./client";
import { updateUser } from "../Profile/client";
import { User, Book, Review } from "../../util";

export default function Management() {
  const [tab, setTab] = useState(0);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = useSelector(
    (state: any) => state.accountReducer.currentUser
  );
  const canToggleRole = currentUser?.role === "SUPERADMIN";

  useEffect(() => {
    (async () => {
      try {
        const [u, b, r] = await Promise.all([
          getAllUsers(),
          getAllBooks(),
          getAllReviews(),
        ]);
        setUsers(u);
        setBooks(b);
        setReviews(r);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRoleToggle = async (user: User) => {
    const newRole = user.role === "USER" ? "ADMIN" : "USER";
    await updateUser(user._id, { role: newRole });
    setUsers((prev) =>
      prev.map((u) => (u._id === user._id ? { ...u, role: newRole } : u))
    );
  };

  const handleDeleteUser = async (userId: string) => {
    await Promise.all([
      deleteReviewsByUser(userId),
      deleteTagsByUser(userId),
      deleteCollectionsByUser(userId),
      deleteUserById(userId),
    ]);
    setUsers((prev) => prev.filter((u) => u._id !== userId));
  };

  const handleDeleteReview = async (reviewId: string) => {
    await Promise.all([
      deleteTagsByReview(reviewId),
      deleteReviewById(reviewId),
    ]);
    setReviews((prev) => prev.filter((r) => r._id !== reviewId));
  };

  const userColumns: GridColDef[] = [
    { field: "email", headerName: "Email", flex: 1 },
    { field: "username", headerName: "Username", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.5 },
    {
      field: "toggle",
      headerName: "Make Admin",
      flex: 0.7,
      sortable: false,
      renderCell: (params: GridRenderCellParams<User>) =>
        canToggleRole && params.row._id !== currentUser._id ? (
          <FormControlLabel
            control={
              <Switch
                checked={params.row.role === "ADMIN"}
                onChange={() => handleRoleToggle(params.row)}
                size="small"
              />
            }
            label={params.row.role === "ADMIN" ? "Admin" : "User"}
          />
        ) : null,
    },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams<User>) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeleteUser(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  const displayedUserColumns = canToggleRole
    ? userColumns
    : userColumns.filter((c) => c.field !== "toggle");

  const bookColumns: GridColDef[] = [
    { field: "bookTitle", headerName: "Title", flex: 1 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Book>) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={async () => {
            await deleteBookById(params.row._id);
            setBooks((prev) => prev.filter((b) => b._id !== params.row._id));
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const reviewColumns: GridColDef[] = [
    { field: "user", headerName: "User ID", flex: 1 },
    { field: "bookTitle", headerName: "Book", flex: 1 },
    { field: "contentReview", headerName: "Review", flex: 2 },
    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      sortable: false,
      renderCell: (params: GridRenderCellParams<Review>) => (
        <Button
          variant="outlined"
          color="error"
          size="small"
          onClick={() => handleDeleteReview(params.row._id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  if (loading) {
    return (
      <>
        <Navigation />
        <Typography align="center" mt={4}>
          Loading admin data…
        </Typography>
      </>
    );
  }

  return (
    <Box sx={{ width: "70vw" }}>
      <Navigation />
      <Button onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        ← Back
      </Button>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <Paper sx={{ mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => setTab(v)}
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab label="Users" />
          <Tab label="Books" />
          <Tab label="Reviews" />
        </Tabs>
      </Paper>

      {tab === 0 && (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: 650 }}>
            <DataGrid
              rows={users.map((u) => ({ ...u, id: u._id }))}
              columns={displayedUserColumns}
              autoHeight
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
              sx={{
                ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
                  {
                    marginTop: "1em",
                    marginBottom: "1em",
                  },
              }}
            />
          </Box>
        </Box>
      )}

      {tab === 1 && (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: 650 }}>
            <DataGrid
              rows={books.map((b) => ({ ...b, id: b._id }))}
              columns={bookColumns}
              autoHeight
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
              sx={{
                ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
                  {
                    marginTop: "1em",
                    marginBottom: "1em",
                  },
              }}
            />
          </Box>
        </Box>
      )}

      {tab === 2 && (
        <Box sx={{ width: "100%", overflowX: "auto" }}>
          <Box sx={{ minWidth: 650 }}>
            <DataGrid
              rows={reviews.map((r) => ({ ...r, id: r._id }))}
              columns={reviewColumns}
              autoHeight
              initialState={{
                pagination: { paginationModel: { pageSize: 5 } },
              }}
              pageSizeOptions={[5, 10]}
              sx={{
                ".MuiTablePagination-displayedRows, .MuiTablePagination-selectLabel":
                  {
                    marginTop: "1em",
                    marginBottom: "1em",
                  },
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
