import { useEffect, useState } from "react";
import "./App.css";
import { destroy, register, retrieve, update } from "./api/user";
import { DataGrid } from "@mui/x-data-grid";
import { ToastContainer, toast } from "react-toastify";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import $ from "jquery";

function App() {
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [editDialog, setEditDialog] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState({});

  const columns = [
    { field: "id", headerName: "ID" },
    { field: "name", headerName: "Name", width: 150 },
    { field: "groupname", headerName: "GroupName", width: 150 },
    { field: "country", headerName: "Country", width: 150 },
    { field: "age", headerName: "Age", width: 150 },
    { field: "thumbnail", headerName: "Thumbnail", width: 150 },
    {
      field: "actions",
      headerName: "",
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Button
            variant="contained"
            color="warning"
            onClick={() => setEditDialog({ ...params.row })}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setDeleteDialog(params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
      width: 200,
    },
  ];

  const refreshData = () => {
    retrieve().then((res) => {
      if (res?.ok) {
        setRows(res.data);
      } else {
        toast.error(res?.message ?? "Something went wrong.");
      }
    });
  };

  useEffect(refreshData, []);

  const onDelete = () => {
    setLoading(true);
    destroy({ id: deleteDialog })
      .then((res) => {
        console.log(res);
        if (res?.ok) {
          toast.success(res?.message ?? "User has been deleted");
          refreshData();
        } else {
          toast.error(res?.message ?? "Something went wrong.");
        }
      })
      .finally(() => {
        setLoading(false);
        setDeleteDialog(null);
      });
  };

  const onEdit = (e) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      update({
        id: editDialog,
        name: editDialog.name,
        groupname: editDialog.groupname,
        country: editDialog.country,
        age: editDialog.age,
        thumbnail: editDialog.thumbnail,
      })
        .then((res) => {
          console.log(res);
          if (res?.ok) {
            toast.success(res?.message ?? "User has updated");
            setEditDialog(null);
            refreshData();
          } else {
            toast.error(res?.message ?? "Something went wrong.");
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  const onCreate = (e) => {
    e.preventDefault();
    if (!loading) {
      const body = {
        name: $("#name").val(),
        groupname: $("#groupname").val(),
        country: $("#country").val(),
        age: $("#age").val(),
        thumbnail: $("#thumbnail").val(),
      };

      register(body)
        .then((res) => {
          if (res?.ok) {
            toast.success(res?.message ?? "Account has been created");
            setCreateDialog(false);
            setWarnings({});
            refreshData();
          } else {
            toast.error(res?.message ?? "Something went wrong.");
            setWarnings(res?.errors);
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          background: "gray",
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography>K-Pop Database</Typography>
        <Button onClick={() => setCreateDialog(true)} id="btn-add">
          Add Idol Name
        </Button>
      </Box>
      <Box>
        <DataGrid autoHeight columns={columns} rows={rows} />
      </Box>
      <Dialog open={deleteDialog !== null}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>
            Do you want to delete this user ID: {deleteDialog}
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            display: deleteDialog !== null ? "flex" : "none",
          }}
        >
          <Button onClick={() => setDeleteDialog(null)} id="btn-cancel">
            Cancel
          </Button>
          <Button disabled={loading} onClick={onDelete} id="btn-confirm">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!editDialog}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ p: 1 }} onSubmit={onEdit}>
            <Box sx={{ mt: 1 }}>
              <TextField
                onChange={(e) =>
                  setEditDialog({
                    ...editDialog,
                    name: e.target.value,
                  })
                }
                value={editDialog?.name ?? ""}
                size="small"
                label="Name"
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              <TextField
                onChange={(e) =>
                  setEditDialog({
                    ...editDialog,
                    groupname: e.target.value,
                  })
                }
                value={editDialog?.groupname ?? ""}
                size="small"
                label="GroupName"
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              <TextField
                onChange={(e) =>
                  setEditDialog({
                    ...editDialog,
                    country: e.target.value,
                  })
                }
                value={editDialog?.country ?? ""}
                size="small"
                label="Country"
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              <TextField
                onChange={(e) =>
                  setEditDialog({
                    ...editDialog,
                    name: e.target.value,
                  })
                }
                value={editDialog?.age ?? ""}
                size="small"
                label="Age"
                fullWidth
              />
            </Box>
            <Box sx={{ mt: 1 }}>
              <TextField
                onChange={(e) =>
                  setEditDialog({
                    ...editDialog,
                    name: e.target.value,
                  })
                }
                value={editDialog?.thumbnail ?? ""}
                size="small"
                label="Thumbnail"
                fullWidth
              />
            </Box>
            <Button id="edit-btn" type="submit" sx={{ display: "none" }}>
              Submit
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(null)} id="btn-cancel">
            Cancel
          </Button>
          <Button
            disabled={loading}
            onClick={() => {
              $("#edit-btn").trigger("click");
            }}
            id="btn-update"
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!createDialog}>
        <DialogTitle>Create Form</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={onCreate}>
            <Box>
              <TextField
                id="name"
                label="Name"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
              {warnings?.name ? (
                <Typography component="small" color="error">
                  {warnings.name}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <TextField
                id="groupname"
                label="GroupName"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
              {warnings?.groupname ? (
                <Typography component="small" color="error">
                  {warnings.groupname}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <TextField
                id="country"
                label="Country"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
              {warnings?.country ? (
                <Typography component="small" color="error">
                  {warnings.country}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <TextField
                id="age"
                label="Age"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
              {warnings?.age ? (
                <Typography component="small" color="error">
                  {warnings.age}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <TextField
                id="thumbnail"
                label="Thumbnail"
                variant="outlined"
                margin="normal"
                fullWidth
                required
              />
              {warnings?.thumbnail ? (
                <Typography component="small" color="error">
                  {warnings.thumbnail}
                </Typography>
              ) : null}
            </Box>
            <Box>
              <Button
                id="submit_btn"
                disabled={loading}
                type="submit"
                sx={{ display: "none" }}
              >
                Submit
              </Button>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button id="btn-cancel" onClick={() => setCreateDialog(false)}>
            Close
          </Button>
          <Button
            onClick={() => {
              $("#submit_btn").trigger("click");
            }}
            id="btn-create"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default App;
