import "./App.css";
import React, { useState, useEffect } from "react";
import AppContext from './components/AppContext.js';
import { createTheme } from "@mui/material/styles";
import Home from ".//components/Routes/Home.js";
import SignUp from ".//components/Routes/SignUp.js";
import Inventory from ".//components/Routes/Inventory.js";
import Login from ".//components/Routes/Login.js";
import Orders2 from ".//components/Routes/Orders2.js";
import Transfers from ".//components/Routes/Transfers.js";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import NavDrawer from "./components/NavDrawer";
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from "@mui/material/styles";
import Users from ".//components/Routes/Users.js";
import UserIssuedItems from "./components/Routes/UserIssuedItems.js";




const customTheme = createTheme({
  palette: {
    primary: {
      main: "#1A73E8",
      light: "#5ca3f4",
      dark: "#004a90",
    },
    secondary: {
      main: "#1A73E8",
    },
  },
});

function App() {
  const [shoppingCart, setShoppingCart] = useState([]);


  //comment out this one if doing local dev ...use this if live///
  const API = {
    website: 'http://shelfapi-env.eba-phxch2is.us-gov-west-1.elasticbeanstalk.com' 
  };


  // use for local developing
  // const API = {
  //   website: 'http://localhost:3000'
  // };

  //

  useEffect(() => {
    //used to test and remove token and will be used in a logout button **wink wink**
    // console.log(localStorage.removeItem("authorization"))
  }, []);

  const NavBarLayout = () => (
    <>
      <NavDrawer shoppingCart={shoppingCart} setShoppingCart={setShoppingCart}  />
      <Outlet />
    </>
  );

  
  return (
      <AppContext.Provider value={{ API }}>
        <ThemeProvider theme={customTheme} >
          <Router>
            <div>
              <Routes>
                <Route element={<NavBarLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/users" element={<Users />} />
                    <Route
                    path="/inventory"
                    element={
                      <Inventory
                        shoppingCart={shoppingCart}
                        setShoppingCart={setShoppingCart}
                      />
                    }
                  />
                                  
                    <Route path="/users" element={<Users />} />
                    <Route path="/users/:name" element={<UserIssuedItems />} />
                    <Route path="/transfers" element={<Transfers />} /> 
                    <Route path="/issueditems" element={<UserIssuedItems />} /> 
                    <Route path="/orders2" element={<Orders2 />} />
                    <Route path="*" element={<Login/>} />
              </Route> 
                    <Route path="/" element={<Login />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path='/external' component={() => { window.location = 'https://tinyurl.com/shelf-inventory'; return null;} }/>

              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </AppContext.Provider>
  );
}
export default App;
