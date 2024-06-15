import React, { useState, useEffect, useContext } from "react";
import AppContext from "./AppContext.js";
import axios from "axios";
import Button from '@mui/material/Button';
import { useNavigate } from "react-router-dom";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function BasicMenu() {
  const [adminWarehouses, setAdminWarehouses] = useState([]); // warehouses admin has access to
  const { API } = useContext(AppContext);

  // initial call to grab users from DB on load
  useEffect(() => {
    fetchLoggedAdminWarehouses();
  }, []);

  /**
   * fetches the logged in user's warehouses from the DB
   */
  const fetchLoggedAdminWarehouses = async () => {
    let adminID = localStorage.user_dod;
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

  const navigate = useNavigate();

  const goToUserDetails = (warehouse) => {
    navigate('/inventory', { state: { warehouse } });
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        onClick={handleClick}
        sx={{ mr: 1 }}
      >
        Inventory
      </Button>
      <Menu
        id="demo-customized-menu"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {adminWarehouses.map((warehouses, index) => (
          <div key={index}>
            {warehouses.warehouse_access?.map((warehouse_access, subIndex) => (
              <MenuItem
                key={subIndex}
                onClick={() => {
                  goToUserDetails(warehouse_access.Name);
                  handleClose();
                }}
              >
                {warehouse_access.Name}
              </MenuItem>
            ))}
          </div>
        ))}
      </Menu>
    </div>
  );
}
