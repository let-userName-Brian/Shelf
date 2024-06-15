
import Box from "@mui/material/Box";

import React, { useEffect } from "react";
import homePage from '..//Images/homePage.jpg'
import useMediaQuery from '@mui/material/useMediaQuery';
import {
  createTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import WebFont from 'webfontloader';

let theme = createTheme();
theme = responsiveFontSizes(theme);


function Home() {

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Arvo' ]
      }
    });
  }, []);

  const matches = useMediaQuery("(min-width:1200px)");

  console.log("LOCAL FROM HOME", localStorage)


  return (
    <div>
      <ThemeProvider theme={theme}>
      <Box sx={{ ml: 12}} >
        <Box sx={{display:'flex' , flexDirection: 'row', maxWidth: '75%'}}>
          <Box
            sx={{
              display:'flex', 
              flexDirection:'column', 
              width:'100%',
              fontFamily:'Arvo',
            }}
          >
          <Box sx={{ mt: 10 }}>
            <div>
            <Typography variant="h3">Welcome to Shelf!</Typography>
            </div>
          </Box>

          <Box sx={{
                fontFamily:'Arvo ',  
                mt: 1, 
                maxWidth: matches ? 600 : 300,
                }}>
            <Typography variant="h5"> An inventory management application that effortlessly manages your 
                  assets digitally, whether you’re in the warehouse or on the go! </Typography>
          </Box>
        </Box>
        <Box
          sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center', ml: 10}}
          >
            {/* <img alt="home page" src={homePage} width='600' height='500' sx={{ flexGrow: 1}}/> */}

            <img alt="home page" src={homePage} width={matches ? 1000 : 600} height={matches ? 700 : 300} />
        </Box>
      </Box>



      </Box>
          </ThemeProvider>

    </div>
  );
}

export default Home;
