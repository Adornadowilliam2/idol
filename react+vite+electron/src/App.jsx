import { useEffect, useState } from "react";
import "./App.css";
import { destroy, register, retrieve, update } from "./api/user";
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
import philippines from "./assets/philippines.png";
import japan from "./assets/japan.png";
import taiwan from "./assets/taiwan.png";
import south_korea from "./assets/south-korea.png";

import { ToastContainer, toast } from "react-toastify";
import { fakeData } from "./index";
function App() {
  const [rows, setRows] = useState([]);
  const [createDialog, setCreateDialog] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(null);
  const [editDialog, setEditDialog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warnings, setWarnings] = useState({});
  const getflag = (character ) =>{
    if (character.country.toLowerCase().includes("japan")) {
      character.flag = japan;
    } else if (character.country.toLowerCase().includes("philippines")) {
      character.flag = philippines;
    } else if (character.country.toLowerCase().includes("taiwan")) {
      character.flag = taiwan;
    } else if (character.country.toLowerCase().includes("south korea")) {
      character.flag = south_korea;
    }
  }

  fakeData.forEach((character) => {
    getflag(character);
  });

  const refreshData = () => {
    retrieve()
      .then((res) => {
        console.log(res);
        if (res?.ok) {
          setRows(res.data);
        } else {
          toast.error(res?.message ?? "Something went wrong.");
          setRows(fakeData);
        }
      })
      .catch(() => {
        toast.error("Failed to fetch data. Using fake data.");
        setRows(fakeData); 
      });
  };

  useEffect(refreshData, []);

  const onDelete = () => {
    setLoading(true);
    destroy({ id: deleteDialog })
      .then((res) => {
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
        id: editDialog.id,
        name: editDialog.name,
        groupname: editDialog.groupname,
        country: editDialog.country,
        age: editDialog.age,
        thumbnail: editDialog.thumbnail,
      })
        .then((res) => {
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

  const groupnameimage = (row) => {
    if (row.groupname == "Twice") {
      return "https://th.bing.com/th?id=OIP.ikppCpXQZXMuXoP-DAaOEAHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&cb=13&pid=3.1&rm=2";
    }else if(row.groupname == "Bini") {
      return "https://th.bing.com/th?id=OIP.XUXEWlhZB4nJ6_DKEq7cIQAAAA&w=166&h=166&c=8&rs=1&qlt=90&o=6&cb=13&pid=3.1&rm=2";
    }
  };

  return (
    <>
      <Box>
        <ToastContainer />
        <Box
          sx={{
            background: "aquamarine",
            p: 1,
          }}
        >
          <Typography variant="h3">Database</Typography>
          <Button id="btn-add" onClick={() => setCreateDialog(true)}>
            Add Idol
          </Button>
        </Box>
        <Box className="card-container">
          {rows.map((row) => (
            <Box className="card" key={row.id}>
              <span className="icon">
                <img
                  src={fakeData[row.id - 1]?.groupname || groupnameimage(row)}
                  alt={row.groupname}
                  className="icon-img"
                />
              </span>
              <img src={row.thumbnail} alt="img-idol" className="pfp" />
              <Box>
                <Typography className="header-h1">Id: {row.id}</Typography>
                <Typography className="header-h2">Name: {row.name}</Typography>
                <Typography className="header-h2">Age: {row.age}</Typography>
                <Typography className="header-h2">
                  Country:
                  <img src={row.flag || getflag(row)} alt="flag"className="country" />
                </Typography>
                <hr />
                <Box id="btn">
                  <Button id="btn-edit" onClick={() => setEditDialog(row)}>
                    Edit
                  </Button>
                  <Button
                    id="btn-delete"
                    onClick={() => setDeleteDialog(row.id)}
                  >
                    Delete
                  </Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        <Dialog open={!!deleteDialog}>
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
      </Box>
    </>
  );
}

export default App;
