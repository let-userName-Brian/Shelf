import React, { useState, useEffect, useContext  } from "react";
import axios from "axios";
import AppContext from "./AppContext.js";
import Autocomplete from '@mui/material/Autocomplete';
import Badge from '@mui/material/Badge';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ClearIcon from "@mui/icons-material/Clear";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import MuiAlert from '@mui/material/Alert';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import shelfLogo from ".//Images/shelfLogo.png";
import Slide from '@mui/material/Slide';
import { styled } from '@mui/material/styles';
import Swal from 'sweetalert2'
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { useLocation } from 'react-router-dom';
import warehouse from ".//Images/warehouse.gif";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';



export default function CheckoutDrawer({ shoppingCart, setShoppingCart, inventory, fetchInventory }) {
  const user_dod = localStorage.getItem("user_dod");
  const [newShoppingCart, setNewShoppingCart] = useState([]); //shopping cart state
  const [users, setUsers] = useState([]); //users state for list of users in drop down
  const [value, setValue] = useState(''); //value state for users drop down
  const [selectedUser, setSelectedUser] = useState(''); //value state for users drop down
  const [radioValue, setRadioValue] = React.useState('');//value state of radio button selection
  const [currentItemCount, setCurrentItemCount] = React.useState(0);//value of count for the current item
  const [cartItemCount, setCartItemCount] = React.useState(0);//value of count for the current item
  const [adminWarehouses, setAdminWarehouses] = React.useState([]);//warehouses admin has access to
  const [adminCart, setAdminCart] = React.useState([]);//warehouses admin has access to
  const location = useLocation();//Raact Router Hooked used to bring in the state of selected user to process checkout
  const [newQuantity, setNewQuantity] = useState({ 
    Quantity: " ",
    uuidDate: " ",
    UUID: " ",
    Original_warehouse: " "
  });   //initial state for updating the Quantity of a requested item in the cart
  const [items, setItems] = useState([]); //state for items in the cart
  const { API } = useContext(AppContext);
  const [state, setState] = React.useState({
    right: false,
  });
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



  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 390 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    ></Box>
  );



  //initial calls
  useEffect(() => {
    fetchUsers();
    fetchNewShoppingCart();
    fetchCurrentItemCount();
    fetchUsers();
    fetchNewShoppingCart();
    fetchLoggedAdminWarehouses();
    fetchLoggedAdminCart();
  }, []);


  /**
   * @returns users
   * fetches DB after any changes to the resutls array from the user on the front end
   */
  const fetchUsers = async () => {
    axios
      .get(`${API.website}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authorization")}`,
        },
      })
      .then((res) => {
        const sortedUsers = res.data.sort((a, b) => {
          if (a.first_name < b.first_name) return -1;
          if (a.first_name > b.first_name) return 1;
          return 0;
        });
        setUsers(sortedUsers);
      })
      .catch((err) => {
        console.log(err);
      });
  };


  /**
   * fetches the current count of the item in the shopping cart
   */
    const fetchCurrentItemCount = async () => {
      let itemUUID = newQuantity.UUID
      let ogWarehouse = newQuantity.Original_warehouse;
      axios
      .get(`${API.website}/currentItemCount/${itemUUID}/${ogWarehouse}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authorization")}`,
        },
      })
      .then((res) => {
        setCurrentItemCount(res.data[0].item_count);
        })
        .catch((err) => {
          console.log(err);
        });
    };


    /**
     * fetches the logged in user's shopping cart from the DB
     */
            const fetchLoggedAdminCart = async () => {
              let adminID = localStorage.user_dod
              // console.log("adminID", adminID)
              axios
              .get(`${API.website}/admin-cart/${adminID}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("authorization")}`,
                },
              })
              .then((res) => {
                setAdminCart(res.data);
              })
              .catch((err) => { 
                console.log(err);
              });
            };
    
            // console.log("CART SHULD BE SHOPPING", adminCart)

  /**
   * shopping Cart fetch
   */
  const fetchNewShoppingCart = async () => {
    // setSpinner(true);
    axios
    .get(`${API.website}/shopping-cart/${user_dod}`, {
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

          /**
     * fetches the logged in user's warehouses from the DB
     */
          const fetchLoggedAdminWarehouses = async () => {
            let adminID = localStorage.user_dod
            axios
            .get(`${API.website}/admin-warehouses/${adminID}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authorization")}`,
              },
            })
            .then((res) => {
              setAdminWarehouses(res.data);
            })
            .catch((err) => { 
              console.log(err);
            });
          };
  

  // function to delete item from shopping_cart column in the users table in db
  const onDelete  = async (items, index) => {
    let id = items.UUID;
    axios.delete(`${API.website}/shopping-cart/${id}/${user_dod}`)
      .then((res) => {
        if (res.status === 200) {
          fetchNewShoppingCart();
          window.location.reload()
        }
      }) 
      .catch((err) => {
        alert("Sorry! Something went wrong. Please try Deleting Item again.");
        console.log("err", err);
      });
  };

  // function that takes the json array of shopping_cart and
  // adds the array to issued_items to the selected user (value = dod_id) then clears the cart

  const addToIssuedItems = async (items, index) => {
    axios
      .patch(`${API.website}/issued-items/${user_dod}/${value}`,)
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

    const StyledBadge = styled(Badge)(({ theme }) => ({
      '& .MuiBadge-badge': {
        right: -3,
        top: 13,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: '0 4px',
      },
    }));

  // function that checks for the amount of objects in the shopping cart in order to display the badge
  const cartLength = newShoppingCart.map(item => item.shopping_cart?.length)

// funciton that updates the state of the radio button selected "Issue to User" or "Issue to Warehouse" or "Return to Warehouse"
  const handleChange = (event) => {
    setRadioValue(event.target.value);
  };

//function that updates the requested quantity of the item in the cart
const changeItemQuantity = async (items, index) => {
  let id = items.UUID;
  let ogWarehouse = newQuantity.Original_warehouse;
  axios
    .patch(`${API.website}/shopping-cart-quantity/${id}/${user_dod}/${ogWarehouse}`,
    newQuantity, 
    )
    .then((res) => {
      if (res.status === 200) {
        fetchNewShoppingCart();
      }
    })
    .catch((err) => {
      alert("Sorry! Something went wrong. Please try again.");
      console.log("err", err);
    });
}

// console.log("QUNAT IS", cartItemCount)

  // Function that updates the count of an item after its been issued to a user
  const subtractFromInventory = async (items, index) => {
    flatCart.forEach((items, index) => {
      let id = items.UUID;
      let ogWarehouse = items.Original_warehouse;
      let returnCount = 0
      console.log("returnCount", returnCount)
      console.log(`id: ${id}, ogWarehouse: ${ogWarehouse}, ItemCount: ${cartItemCount}, items.Quantity: ${items.Quantity}`);
      axios
      .get(`${API.website}/cartItemCount/${id}/${ogWarehouse}`,)
      .then((res) => {
        returnCount = res.data[0].item_count
        let newCount = returnCount - items.Quantity;
        axios
          .patch(`${API.website}/inventorysubtractcount/${id}/${newCount}/${user_dod}/${ogWarehouse}`,
          newQuantity, 
          )
          axios
          .patch(`${API.website}/removeitemfromcart/${id}/${user_dod}`,
          )
          if (res.status === 200) {
            fetchNewShoppingCart();
            // fetchInventory();
          }
      })
      .catch((err) => {
        alert("Sorry! Something went wrong. With Issuing Items.");
        console.log("err", err);
      });
    })
  };

//function that for each index of flatCart, updates the count of the item in the warehouse and then removes the item from the cart
  const addToInventoryCount = async (items, index) => {
    flatCart.forEach((items, index) => {
      let id = items.UUID;
      let newCount = currentItemCount+items.Quantity;
      let ogWarehouse = items.Original_warehouse;
      let user_dodid = location.state.DoD;
      // console.log("ID", id)
      // console.log("newCount", newCount)
      // console.log("ogWarehouse", ogWarehouse)
      // console.log("user_dodid", user_dodid)
      // console.log("USER_DOD", user_dod)
      axios
        .patch(`${API.website}/inventoryaddcount/${id}/${newCount}/${user_dodid}/${user_dod}`,
        newQuantity, 
        )
        axios
        .patch(`${API.website}/removeitemfromcart/${id}/${user_dod}`, 
        )
      .then((res) => {
        if (res.status === 200) {
          fetchNewShoppingCart();
          // fetchInventory();
        }
      })
      .catch((err) => {
        alert("Sorry! Something went wrong. Please try again.");
        console.log("err", err);
      });
    })
  };

    // const addToInventoryCount = async (items, index) => {
    //   flatCart.forEach((items, index) => {
    //   let id = newQuantity.UUID;
    //   let quantity = newQuantity.Quantity
    //   let newCount = currentItemCount + +quantity ;
    //   let user_dodid = location.state.DoD;
    //   console.log("CART",flatCart)
    //   // axios
    //   //   .patch(`http://localhost:3000/inventoryaddcount/${id}/${newCount}/${user_dodid}/${user_dod}`,
    //   //   newQuantity, 
    //   //   )
    //     axios
    //     .patch(`http://localhost:3000/removeitemfromcart/${id}/${user_dod}`, 
    //     )
    //     .then((res) => {
    //       if (res.status === 200) {
    //         // fetchNewShoppingCart();
    //         console.log("Added Item to inventory")
    //       }
    //     })
    //     .catch((err) => {
    //       alert("Sorry! Something went wrong. Please try again.");
    //       console.log("err", err);
    //     });
    //   }
    // )};


  

  //Change count of item in th inventory after the requested quantity is submitted in the cart
  const addToSelectedWarehouse = async (items, index) => {
    flatCart.forEach((items, index) => {
    let id = items.UUID;
    let selectedWarehouse = value;
    let newCount = currentItemCount-items.Quantity;
    let ogWarehouse = items.Original_warehouse;
    axios
      .patch(`${API.website}/addToSelectedWarehouse/${selectedWarehouse}`, items
      ); console.log("ITEMS ADD TO SELECTED", items)
      axios
      .patch(`${API.website}/inventorysubtractcount/${id}/${newCount}/${user_dod}/${ogWarehouse}`,
      )
      axios
      .patch(`${API.website}/removeitemfromcart/${id}/${user_dod}`, 
      )
      .then((res) => {
        if (res.status === 200) {
          fetchNewShoppingCart();
        }
      })
      .catch((err) => {
        alert("Sorry! Something went wrong. Please try again.");
        console.log("err", err);
      });
      // window.location.reload();
    })
  }


    


//States and funcitons for snackbars
    const [openSnack, setOpenSnack] = React.useState(false);
    const [transition, setTransition] = React.useState(undefined);

    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    
  
      function TransitionLeft(props) {
        return <Slide {...props} direction="left" />;
      }
    
      const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
            setOpenSnack(false);
      };


      // const handleClick = (Transition) => () => {
      //   setTransition(() => Transition);
      //   setOpenSnack(true);
      // };

      const handleClick = () => () => {
        setOpenSnack(true);
      };
    
      const availableWarehouses = adminWarehouses?.map(warehouse => warehouse?.warehouse_access?.map(warehouses => {
        return warehouses
      }))

      const flatWarehouses = availableWarehouses.flat()

      const cart = newShoppingCart?.map((item, index) => item.shopping_cart?.map((items, index) => {
        return items
      }))

      const flatCart = cart.flat()

      //path to warehouse image
      const imagePath = require(`./Images/warehouse.gif`)


      const fireSwal = () => {
        let timerInterval
          Swal.fire(
            {
            title: `Issuing items`,         
            // html: 'I will close in <b></b> milliseconds.',
            timer: 3000,
            timerProgressBar: true,
            iconUrl: imagePath,
            didOpen: () => {
              Swal.showLoading()
              const b = Swal.getHtmlContainer().querySelector('b')
              timerInterval = setInterval(() => {
                b.textContent = Swal.getTimerLeft()
              }, 100)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
              console.log('I was closed by the timer')
              Swal.fire({
                icon: 'success',
                title: `Issued items to ${selectedUser.first_name} ${selectedUser.last_name}'s Account!`,   
                showConfirmButton: false,
                timer: 1500
                }
              )
              setTimeout(() => {
                window.location.reload();
              }, "1400")
            }
          })
        }


        const clearCart  = async () => {
          console.log("user dod_id FROM THIS STUPID BUTTON", user_dod)
          axios.patch(`${API.website}/clear-shopping-cart/${user_dod}`)
            .then((res) => {
              if (res.status === 200) {
                fetchNewShoppingCart();
                window.location.reload()
              }
            }) 
            .catch((err) => {
              alert("Sorry! Something went wrong. Please try Clearing Cart again.");
              console.log("err", err);
              console.error()
            });
        };

  

  return (
    
    <div>
      {["right"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Tooltip title="Shopping Cart">
            {cartLength >= 1 ? (
              <StyledBadge badgeContent={cartLength}>
                <ShoppingCartIcon
                  onClick={toggleDrawer(anchor, true)}
                >
                  {anchor}
                </ShoppingCartIcon>
              </StyledBadge>
            ) : (
              <ShoppingCartIcon
                sx={{ color: "white", mt:1 }}
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
            sx= {{ width: "500px" }}
          >
            {list(anchor)}
            <List>
              <ListItem
                sx={{ display: "flex", justifyContent: "center", mt: 7 }}
              >
              <Box sx={{ display: "flex", flexDirection: "row" }}>
                <Box sx={{ mt:3 }}>
                  <img alt="shelf logo" src={shelfLogo} width="40" height="40" />
                </Box>
                <Box sx={{ ml:1, fontSize: 19 }}>
                  <h2>Shopping Cart</h2>
                </Box>
              </Box>
              </ListItem>

              <Divider
                sx={{ mt: 1.5, bgcolor: "#155E9C", borderBottomWidth: 3 }}
              />


            <Box sx={{ display: "flex", justifyContent:"flex-end", mt: 0.5, mr:10}}>
            {cartLength >= 1 ? (
              <Button 
                variant="outlined"
                // size="small"
                color="primary"
                sx={{width: 89, height: 20, fontSize:8.5}}
                onClick={() => {
                  clearCart()
                  // window.location.reload()
                }}
                > Clear Cart</Button>
            ) : null}

{/* <IconButton aria-label="delete" size="small">
        <DeleteIcon fontSize="inherit" />
      </IconButton> */}
          </Box>

            <ListItem>
              {newShoppingCart.map((item, index) => {
                return (
                  <div key={index}>
                {item.shopping_cart?.map((items, index) => {
                  return (
                    <div key={index}>
                    {cartLength >= 1 ? (
                    <Box
                        sx={{
                        display: "flex",
                        flexDirection: "column"
                      }}
                    >
                        <Box
                          sx={{
                            display: "flex",
                            mt: 2.5,
                            ml: 3,
                            flexDirection: "column",
                            width: "1000",
                          }}
                        >
                          <Box sx={{display:'flex', flexDirection: "row"}}>
                            <Box>
                              <Box sx={{ width: 100, fontSize: '15px', height: 45}}>
                                <h4>{items.Name}</h4>
                              </Box>
                              <Box sx={{  fontStyle: 'italic', fontSize: '14px' }}> 
                                Size : {items.Size}
                              </Box>
                            </Box>

                            <Box>
                          
                            <TextField
                              required
                              id="filled"
                              variant="outlined"
                              label="Quantity"
                              type="number"              
                              // defaultValue={items.Quantity}
                              defaultValue= "0"
                              InputProps={{
                                inputProps: { 
                                    min: 0, 
                                    max: items.Count,
                                }
                            }}
                              style={{ width: 95, height: 60 }}
                              sx={{ ml: 2 }}
                              onChange={(e) => 
                                {if (e.target.value === "" || e.target.value === null || e.target.value === undefined || e.target.value < 0) {
                                  setNewQuantity({ ...newQuantity, Quantity: 0, uuidDate: items.UUIDfetcha, UUID: items.UUID, Original_warehouse: items.Original_warehouse })                
                              } else {
                                {if (e.target.value !== "" || e.target.value !== null || e.target.value !== undefined && e.target.value > 0) {
                                      setNewQuantity({ ...newQuantity, Quantity: e.target.value, uuidDate: items.UUIDfetcha, UUID: items.UUID, Original_warehouse: items.Original_warehouse  })
                                      }}}}}
                              onBlur={() => { changeItemQuantity(items, index)
                                              fetchCurrentItemCount()
                              }}
                            />

                         
                              {window.location.href === `${API.website}/inventory` ? (
                            <Box sx={{ ml:2, fontStyle: 'italic', fontSize: '13px' }}> 
                                Available: {items.Count}
                            </Box>) : window.location.href === `${API.website}/issueditems` && items.Quantity !== undefined ?  (
                            <Box sx={{ ml:2, fontStyle: 'italic', fontSize: '13px' }}> 
                                Available: {items.Quantity}
                            </Box>
                            ) : null}
                            </Box>
                          
                            <Box
                              sx={{
                                display: "flex",
                                alignContent: "center",
                                ml: 6,
                              }}
                            >
                              <ClearIcon fontSize="x-small" 
                              onClick={() => {
                                onDelete(items, index)
                                // window.location.reload()
                              }}
                              />
                            </Box>

                            
                          </Box>
                              <Divider sx={{ mt: 2, bgcolor: "#155E9C", borderBottomWidth: 3 }}/>
                            </Box>
                          </Box>
                          ) : null}
                          </div>
                          )})}
                        </div>  
                        )})}
            </ListItem>

            
            <ListItem
            sx={{ display: "flex", flexDirection: "column"}}>
              {cartLength >= 1 ? (
            <Box>
              <FormControl>
              {/* <FormLabel id="demo-radio-buttons-group-label"> </FormLabel> */}
              <RadioGroup
    aria-labelledby="demo-controlled-radio-buttons-group"
    name="controlled-radio-buttons-group"
    value={radioValue}
    onChange={(e) => setRadioValue(e.target.value)}
  >
                <FormControlLabel value="Issue To User" control={<Radio />} label="Issue To User"  />
                <FormControlLabel value="Return To Warehouse"  control={<Radio />} label="Return To Warehouse"  />
                {/* <FormControlLabel value="Issue To Warehouse"  control={<Radio />} label="Issue To Warehouse"  /> */}
              </RadioGroup>
            </FormControl>
              
              {radioValue === "Issue To User" ? (  
                <Box sx={{mt:2}}>
                  <Divider sx={{ mt: 2, bgcolor: "#155E9C", borderBottomWidth: 3 }}/>
                  <h4>Issue To: </h4>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={users}
                    onChange={(event, newValue) => {
                      setValue(newValue.dod_id);
                      setSelectedUser(newValue)
                    }}
                    getOptionLabel={(option) => option.first_name + " " + option.last_name}
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Users" variant="outlined" />
                      )}
                      />
                <Box sx={{mt:2, display: "flex", justifyContent: "center"}}>
                  <Button
                    variant="contained"
                    color="primary"
                    size= "large"
                    onClick={(items, index) => {
                      addToIssuedItems();
                      subtractFromInventory(items, index)  
                      toggleDrawer(anchor, false)
                      setState({ ...state, [anchor]: false })   
                      // setTimeout(() => {
                      //   window.location.reload();
                      // }, "1200")
                      fireSwal();
                      }
                    }
                  >
                    CHECKOUT
                  </Button>
                </Box>
              </Box>

              ) : radioValue === "Return To Warehouse" ? (
                <Box sx={{mt:2}}>
                <Divider sx={{ mt: 2, bgcolor: "#155E9C", borderBottomWidth: 3 }}/>
                <h4>Return To: {value}  </h4>
                  <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    options={flatWarehouses}
                    onChange={(event, newValue) => {
                      setValue(newValue.Table);
                    }}
                    getOptionLabel={(option) => option.Name }
                    style={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Warehouses" variant="outlined" />
                      )}
                      />
                <Box sx={{mt:2, display: "flex", justifyContent: "center"}}>
                    <Button
                      variant="contained"
                      color="primary"
                      size= "large"
                      onClick={(items, index) => {
                        addToInventoryCount ();
                        setTimeout(() => {
                          window.location.reload();
                        }, "1000")
                        }
                      }
                    >
                      CHECKOUT
                    </Button>
                  </Box>
              </Box>
                ) 
                : radioValue === "Issue To Warehouse" ? (
                  <Box sx={{mt:2}}>
                  <Divider sx={{ mt: 2, bgcolor: "#155E9C", borderBottomWidth: 3 }}/>
                  <h4>Issue To: {value}  </h4>        
                    <Autocomplete
                      disablePortal
                      id="combo-box-demo"
                      options={flatWarehouses}
                      onChange={(event, newValue) => {
                        setValue(newValue.Table);
                      }}
                      getOptionLabel={(option) => option.Name }             
                      style={{ width: 300 }}
                      renderInput={(params) => (
                        <TextField {...params} label="Warehouses" variant="outlined" />
                        )}
                        />
                        
                  <Box sx={{mt:2, display: "flex", justifyContent: "center"}}>
                      <Button
                        variant="contained"
                        color="primary"
                        size= "large"
                        onClick={(items, index) => {
                          addToSelectedWarehouse()//this needs to be the new function
                          // setTimeout(() => {
                          //   flatCart.forEach(subtractFromInventory(items, index))
                          // }, "450")
                            setTimeout(() => {
                              window.location.reload();
                            }, "900")
                          }}
                      >
                        CHECKOUT
                      </Button>
                    </Box>
                </Box>
                  )
                   : null}
            </Box>
              ) : 
              <div>
                <Box sx={{mt: 10}}>
                  <Box sx={{ml: 5}}>
                    Your cart is currently empty.
                  </Box>
                  <Box>
                    Add to the cart to issue or return items.
                  </Box>
                </Box>
              </div>
              }
            </ListItem>
            </List>
          </Drawer> 
        </React.Fragment>    
      ))}
    </div>
  );
}


                



