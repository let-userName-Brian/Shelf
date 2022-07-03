import React, { useState, useEffect } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import axios from "axios";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CancelIcon from "@mui/icons-material/Cancel";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import Modal from "@mui/material/Modal";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import warehouse from "..//Images/warehouse.gif";

export default function RowsGrid({
  inventory,
  fetchInventory,
  spinner,
}) {
  const [newShoppingCart, setNewShoppingCart] = useState([]); //shopping cart state
  const user_dod = localStorage.getItem("user_dod");
  const [editedItem, setEditedItem] = useState({
    Name: "",
    Brand: "",
    NSN: "",
    Bldg: "",
    Size: "-",
    Count: 0,
    Gender: "-",
    Aisle: "",
    Initial: false,
    MinCount: 0,
    Ordered: 0,
    Returnable: false,
    Courier: "-",
    Tracking: "-",
  });

  const [newValue, setNewValue] = useState({
    Delete: "",
    Name: "",
    Brand: "",
    NSN: "",
    Bldg: "",
    Size: "-",
    Count: 0,
    Gender: "-",
    Aisle: "",
    Initial: false,
    MinCount: 0,
    Ordered: 0,
    Returnable: true,
    Courier: "-",
    Tracking: "-",
  });
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const onDelete = async (params) => {
    let id = params.formattedValue;
    axios({
      method: "delete",
      url:
        "http://localhost:3000/inventory" ||
        "https://postgres-apr.herokuapp.com/inventory",
      data: {
        id: id,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          fetchInventory();
        }
      })
      .catch((err) => {
        alert("Sorry! Something went wrong. Please try again.");
        console.log("err", err);
      });
  };

  const onEditOpen = (params) => {
    setEditedItem(params.row);
    setNewValue(params.row);
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setOpen(false);
    axios({
      method: "patch",
      url:
        "http://localhost:3000/inventory" ||
        "https://postgres-apr.herokuapp.com/inventory",
      data: {
        Delete: newValue.Delete,
        Name: newValue.Name,
        Brand: newValue.Brand,
        NSN: newValue.NSN,
        Bldg: newValue.Bldg,
        Size: newValue.Size,
        Count: newValue.Count,
        Gender: newValue.Gender,
        Aisle: newValue.Aisle,
        Initial: newValue.Initial,
        MinCount: newValue.MinCount,
        Ordered: newValue.Ordered,
        Returnable: newValue.Returnable,
        Courier: newValue.Courier,
        Tracking: newValue.Tracking,
      },
    })
      .then(() => {
        console.log("success");
        fetchInventory();
      })
      .catch((err) => {
        console.log("err", err);
      });
  };

  /**
   * adds to shopping cart column in the users table
   */
    const addToCart = async (params) => {
      let userShoppingCart = params.row;
      axios
        .patch(`http://localhost:3000/shopping-cart/${user_dod}`, userShoppingCart)
        .then((res) => {
          if (res.status === 200) {
            setNewShoppingCart([...newShoppingCart, userShoppingCart]);
          }
        })
        .catch((err) => {
          alert("Sorry! Something went wrong. Please try again.");
          console.log("err", err);
        });
      };



  //initial call to grab inventory from DB on load
  useEffect(() => {
    fetchNewShoppingCart();
  }, []);

  /**
   * shopping Cart fetch
   */
  const fetchNewShoppingCart = async () => {
    // setSpinner(true);
    axios
      .get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authorization")}`,
        },
      })
      .then((res) => {
        setNewShoppingCart(res.data);
        // setSpinner(false);
      })
      .catch((err) => {
        console.log(err);
        // setSpinner(false);
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        width: "93%",
        overflow: "hidden",
        ml: 7,
        boxShadow: 10
      }}
    >
      {spinner ? (
        <div>
          <img alt="warehouse" src={warehouse} width="900" />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            height: "75vh",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", height: "100%", width: "100%" }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                // checkboxSelection
                disableSelectionOnClick
                initialState={{
                  sorting: {
                    sortModel: [{ field: "Name", sort: "asc" }],
                  },
                  pagination: {
                    pageSize: 50,
                  },
                }}
                components={{ Toolbar: GridToolbar }}
                stopColumnsSorts={[{ field: "Delete", sortable: false }]}
                columns={[
                  { field: "Name", minWidth: 150 },
                  { field: "Brand", minWidth: 130 },
                  { field: "NSN", minWidth: 100 },
                  { field: "Size", minWidth: 100 },
                  { field: "Gender", minWidth: 100 },
                  { field: "Bldg", minWidth: 100 },
                  { field: "Aisle", minWidth: 100 },
                  { field: "Count", minWidth: 100 },
                  {
                    field: "Count Status",
                    renderCell: (params) => (
                      <div>
                        {params.row.Count >
                        params.row.MinCount + params.row.MinCount * 0.25 ? (
                          <FiberManualRecordIcon sx={{ color: "#4CAF50" }} />
                        ) : params.row.Count <=
                            params.row.MinCount + params.row.MinCount * 0.25 &&
                          params.row.Count >= params.row.MinCount ? (
                          <FiberManualRecordIcon sx={{ color: "#fb8c00" }} />
                        ) : params.row.Count < params.row.MinCount ? (
                          <FiberManualRecordIcon sx={{ color: "#ff0000" }} />
                        ) : null}
                      </div>
                    ),
                  },
                  { field: "Ordered", minWidth: 100 },
                  { field: "Initial", minWidth: 100 },
                  { field: "Returnable", minWidth: 100 },
                  {
                    field: "Issue",
                    minWidth: 10,
                    editable: true,
                    renderCell: (params) => (
                      <Tooltip title="Issue Item">
                        <AddCircleIcon
                          sx={{ cursor: "pointer", color: "#4CAF50" }}
                          onClick={() => addToCart(params)}
                        />
                      </Tooltip>
                    ),
                  },
                  {
                    field: "Edit",
                    minWidth: 10,
                    editable: true,
                    renderCell: (params) => (
                      <Tooltip title="Edit Item">
                        <EditIcon
                          sx={{ cursor: "pointer", color: "#fb8c00" }}
                          onClick={() => onEditOpen(params)}
                        />
                      </Tooltip>
                    ),
                  },
                  {
                    field: "Delete",
                    minWidth: 10,
                    renderCell: (params) => (
                      <Tooltip title="Delete Item">
                        <DeleteIcon
                          sx={{ cursor: "pointer", color: "#ef5350" }}
                          onClick={() => onDelete(params)}
                        />
                      </Tooltip>
                    ),
                  },
                ]}
                rows={inventory?.map((row, index) => {
                  return {
                    id: index,
                    Delete: row.item_id,
                    Edit: row.item_id,
                    Name: row.item_name,
                    Brand: row.brand,
                    NSN: row.nsn,
                    Bldg: row.building,
                    Size: row.item_size,
                    Count: row.item_count,
                    Gender: row.gender,
                    Aisle: row.aisle,
                    Initial: row.intial_gear,
                    MinCount: row.minimum_count,
                    Ordered: row.ordered,
                    Returnable: row.returnable_item,
                  };
                })}
              />

              <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 425,
                    bgcolor: "background.paper",
                    borderRadius: "16px",
                    boxShadow: "0px 2px 0px 0px #FF9A01,0px 2px 25px 5px #FF9A01",
                    p: 4,
                    borderColor: "#FF9A01",
                  }}
                >
                  <CardContent>
                    <Box>
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          sx={{ fontSize: 22 }}
                          color="text.primary"
                          gutterBottom
                        >
                          Edit Item: {editedItem?.Name} {editedItem.Brand}{" "}
                          {editedItem?.Size}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      id="modal-modal-description"
                      component="form"
                      sx={{
                        "& .MuiTextField-root": { m: 1, width: "15ch" },
                        mt: 2,
                      }}
                      noValidate
                      autoComplete="off"
                    >
                      <div>
                        <TextField
                          disabled={false}
                          id="filled"
                          variant="filled"
                          label="Name"
                          defaultValue={editedItem?.Name}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({ ...newValue, Name: e.target.value })
                          }
                        />
                        <TextField
                          id="filled"
                          variant="filled"
                          label="NSN"
                          defaultValue={editedItem?.NSN}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({ ...newValue, NSN: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Building"
                          defaultValue={editedItem?.Bldg}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({ ...newValue, Bldg: e.target.value })
                          }
                        />
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Aisle"
                          defaultValue={editedItem?.Aisle}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({ ...newValue, Aisle: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Size"
                          defaultValue={editedItem?.Size}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({ ...newValue, Size: e.target.value })
                          }
                        />
                        <TextField
                          id="filled"
                          variant="filled"
                          label="In Stock"
                          type="number"
                          defaultValue={editedItem?.Count}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({ ...newValue, Count: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Minimum Count"
                          type="number"
                          defaultValue={editedItem?.MinCount}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({
                              ...newValue,
                              MinCount: e.target.value,
                            })
                          }
                        />
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Ordered"
                          type="number"
                          defaultValue={editedItem?.Ordered}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({
                              ...newValue,
                              Ordered: e.target.value,
                            })
                          }
                        />
                        {/* <TextField
                          id="filled"
                          variant="filled"
                          label="Courier"
                          defaultValue={editedItem?.Courier}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: '5' }}
                          onChange={(e) => setNewValue({ ...newValue, Courier: e.target.value })}
                        />
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Tracking"
                          defaultValue={editedItem?.Tracking}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: '5' }}
                          onChange={(e) => setNewValue({ ...newValue, Tracking: e.target.value})}
                        />  */}
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Initial Gear"
                          defaultValue={editedItem?.Initial}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({
                              ...newValue,
                              Initial: e.target.value,
                            })
                          }
                        />
                        <TextField
                          id="filled"
                          variant="filled"
                          label="Returnable Item"
                          defaultValue={editedItem?.Returnable}
                          sx={{ backgroundColor: "#ffb74d", borerRadius: "5" }}
                          onChange={(e) =>
                            setNewValue({
                              ...newValue,
                              Returnable: e.target.value,
                            })
                          }
                        />
                      </div>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Box sx={{ ml: 7, mt: 1 }}>
                      <Stack direction="row" spacing={2}>
                        <Button
                          color="secondary"
                          variant="contained"
                          type="submit"
                          startIcon={<SaveIcon />}
                          onClick={(e) => handleSubmit(e)}
                        >
                          Save
                        </Button>

                        <Button
                          color="secondary"
                          variant="outlined"
                          startIcon={<CancelIcon />}
                          onClick={() => setOpen(false)}
                        >
                          Cancel
                        </Button>
                      </Stack>
                    </Box>
                  </CardActions>
                </Box>
              </Modal>
            </div>
          </div>
        </div>
      )}
    </Box>
  );
}