import React, { useState, useEffect } from "react";
import axios from "axios";
import Autocomplete from '@mui/material/Autocomplete';
import Badge from '@mui/material/Badge';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SaveIcon from "@mui/icons-material/Save";
import shelfLogo from ".//Images/shelfLogo.png";
import { styled } from '@mui/material/styles';
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";



export default function CheckoutDrawer({ shoppingCart, setShoppingCart, inventory, fetchInventory, }) {
  const user_dod = localStorage.getItem("user_dod");

  const [newShoppingCart, setNewShoppingCart] = useState([]); //shopping cart state
  const [users, setUsers] = useState([]); //users state for list of users in drop down
  const [value, setValue] = useState(''); //value state for users drop down
  const [state, setState] = React.useState({ right: false });

  //initial call to grab users from DB on load
  useEffect(() => {
    fetchUsers();
    fetchNewShoppingCart();
    console.log(user_dod)
    //breaks the app into a loop *****
    // if (localStorage.getItem("authorization") === null)
    //   window.location.href = "/login";
  }, []);

  const cartLength = newShoppingCart?.map(item => item.shopping_cart.length)
  const StyledBadge = styled(Badge)(({ theme }) => ({
    '& .MuiBadge-badge': {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: '0 4px',
    },
  }));

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 275 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    ></Box>
  );

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ ...state, [anchor]: open });
  }; //drawer for the shopping cart



  /**
   * @returns users
   * fetches DB after any changes to the resutls array from the user on the front end
   */
  const fetchUsers = async () => {
    axios
      .get("http://localhost:3000/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authorization")}`,
        },
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /**
   * shopping Cart fetch
   */
  const fetchNewShoppingCart = async () => {
    // setSpinner(true);
    axios
      .get(`http://localhost:3000/shopping-cart/${user_dod}`, {
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

  // function to delete item from shopping_cart column in the users table in db
  const onDelete = async (items, index) => {
    console.log("item from front end going to db", items.UUID);
    let id = items.UUID;
    axios.delete(`http://localhost:3000/shopping-cart/${id}/${user_dod}`)
      .then((res) => {
        if (res.status === 200) {
          fetchNewShoppingCart();
        }
      })
      .catch((err) => {
        alert("Sorry! Something went wrong. Please try again.");
        console.log("err", err);
      });
  };

  // function to issue items to user then clears the cart
  const addToIssuedItems = async () => {
    axios
      .patch("http://localhost:3000/issued-items")
      .then((res) => {
        if (res.status === 200) {
          fetchNewShoppingCart();
        }
      })
      .catch((err) => {
        alert("Sorry! Something went wrong. Please try again.");
        console.log("err", err);
      });
  };


  return (
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Tooltip title="Shopping Cart">
            {newShoppingCart.length >= 1 ? (
              <StyledBadge badgeContent={cartLength}>
                <ShoppingCartIcon
                  onClick={toggleDrawer(anchor, true)}
                >
                  {anchor}
                </ShoppingCartIcon>
              </StyledBadge>
            ) : (
              <ShoppingCartIcon
                sx={{ color: "white" }}
                onClick={toggleDrawer(anchor, true)}
              >
                {anchor}
              </ShoppingCartIcon>
            )}
          </Tooltip>
          <Drawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
          >
            {list(anchor)}
            <List>
              <ListItem
                sx={{ display: "flex", justifyContent: "center", mt: 7 }}
              >
                <img alt="shelf logo" src={shelfLogo} width="30" height="30" />
                <h2>Shopping Cart</h2>
              </ListItem>
              <Divider
                sx={{ mt: 2, bgcolor: "#155E9C", borderBottomWidth: 3 }}
              />
              <ListItem>
                {newShoppingCart?.map((item, index) => {
                  return (
                    <div key={index}>
                      {item.shopping_cart?.map((items, index) => {
                        return (
                          <div key={index}>
                            <Box
                              sx={{
                                display: "flex",
                                mt: 2,
                                ml: 3,
                                flexDirection: "row",
                                width: "1000",
                              }}
                            >
                              <Box sx={{ width: 100 }}>
                                <p>{items.Name}</p>
                              </Box>
                              <Box>
                                <TextField
                                  required
                                  id="filled"
                                  variant="outlined"
                                  label="Quantity"
                                  type="number"
                                  defaultValue=""
                                  style={{ width: 95, height: 80 }}
                                  sx={{ ml: 2 }}
                                />
                              </Box>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignContent: "center",
                                  ml: 6,
                                }}
                              >
                                <ClearIcon fontSize="x-small" onClick={() => onDelete(items, index)} />
                              </Box>
                            </Box>
                          </div>
                        )
                      }
                      )}
                    </div>
                  )
                }
                )}
              </ListItem>
              <ListItem>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={users}
                  onChange={(event, newValue) => {
                    setValue(newValue.dod_id);
                  }}
                  getOptionLabel={(option) => option.first_name + " " + option.last_name}
                  style={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Users" variant="outlined" />
                  )}
                />
              </ListItem>
              <ListItem
                disablePadding
                sx={{ display: "flex", justifyContent: "center", mt: 2 }}
              >
                <Button
                  color="secondary"
                  variant="contained"
                  box-sizing="medium"
                  startIcon={<SaveIcon />}
                  onClick={() => addToIssuedItems()}
                >
                  Checkout
                </Button>
              </ListItem>
            </List>
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}




