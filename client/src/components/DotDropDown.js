import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import DeleteModal from "./DeleteModal.js";
import DetailsModal from "./DetailsModal.js";
import EditModal from "./EditModal.js";
import Menu from '@mui/material/Menu';
import MoreVert from '@mui/icons-material/MoreVert';



export default function DotDropDown({ inventory }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    // console.log('inventory', inventory);
    // console.log('id', id)
  }, [])
  //Modal for Delete View
  // const [DeleteModalOpen, setDeleteModalOpen] = React.useState(false);
  // const handleDeleteOpen = () => setDeleteModalOpen(true);
  // const handleCloseDeleteModal = () => setDeleteModalOpen(false);

  //Modal for Details Modal
  // const [DetailsModalOpen, setDetailsModalOpen] = React.useState(false);
  // const handleDetailsOpen = () => setDetailsModalOpen(true);
  // const handleCloseDetailsModal = () => setDetailsModalOpen(false);    

  //Modal for Edit View
  // const [EditModalOpen, setEditModalOpen] = React.useState(false);
  // const handleEditOpen = () => setEditModalOpen(true);
  // const handleCloseEditModal = () => setEditModalOpen(false);


  //   let func1 = (handleClose);
  //   let func2 = (handleEditOpen);
  //   let func3 = (handleDeleteOpen);
  //   let func4 = (handleDetailsOpen);
  //   let func5 = (handleCloseDetailsModal);


  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        sx={{ alignContent: 'flex-end', fontSize: 20, color: '#9e9e9e' }}
      >
        <MoreVert />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <EditModal inventory={inventory} />
        <DetailsModal inventory={inventory} />
        <DeleteModal inventory={inventory} />
      </Menu>
    </div>

  );
}