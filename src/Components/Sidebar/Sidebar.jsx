// import React, { useEffect, useState } from 'react';
// import Box from '@mui/material/Box';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemText from '@mui/material/ListItemText';
// import IconButton from '@mui/material/IconButton';
// import CloseIcon from '@mui/icons-material/Close';
// import Typography from '@mui/material/Typography';
// import TextField from '@mui/material/TextField';
// import { useNavigate} from 'react-router-dom';

// export const Sidebar = ({ propFunc, propArr, propBoolFunc, propBoolIn, onItemClick }) => {
//   const [open, setOpen] = useState(false);
//   const [filterText, setFilterText] = useState('');
//   const [filteredItems, setFilteredItems] = useState(propArr);
//   const [clickedButton, setClickedButton] = useState(null);

//   const navigate = useNavigate();

//   useEffect(() => {
//     setOpen(propBoolIn);
//   }, [propBoolIn]);

//   // useEffect(() => {
//   //   setFilteredItems(
//   //     propArr.filter(item => item.toLowerCase().includes(filterText.toLowerCase()))
//   //   );
//   // }, [filterText, propArr]);
//   useEffect(() => {
//     console.log('propArr:', propArr); // Debugging to verify the structure
//     setFilteredItems(
//       propArr.filter(item => {
//         if (typeof item === 'string') {
//           return item.toLowerCase().includes(filterText.toLowerCase());
//         } else if (item && typeof item === 'object' && item.name) {
//           return item.name.toLowerCase().includes(filterText.toLowerCase());
//         }
//         return false; // Skip if item is undefined or doesn't match expected structure
//       })
//     );
//   }, [filterText, propArr]);
  
  
//   const handleSideBarClose = () => {
//     setOpen(false);
//     propBoolFunc(false);
//   };

//   if (open === true) {
//     propFunc(210);
//   } else {
//     propFunc(0);
//   }

//   const handleClick = (text) => {
//     onItemClick(text);
//     setClickedButton(text);
//     // if(text==='Analytics Dashboard') {
//     //   navigate('/Analytics')
//     // }
    
//   };

//   const DrawerList = (
//     <Box sx={{ width: 200, height:'3000px', backgroundColor: 'rgb(253, 215, 52)', marginTop: 8, color: 'black' }} role="presentation">
//       <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
//         <Typography variant="h6" sx={{ color: 'black' }}>
          
//         </Typography>
//         <IconButton onClick={handleSideBarClose} sx={{ color: 'black' }}>
//           <CloseIcon />
//         </IconButton>
//       </div>
      
//       <List>
//       <TextField
//         variant="outlined"
//         margin="normal"
//         fullWidth
//         placeholder="　Filter items"
//         value={filterText}
//         onChange={(e) => setFilterText(e.target.value)}
//         sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 1, margin: '0 10px 10px 10px', width:'90%' }}
//       />
//         {filteredItems.map((text) => (
//           <ListItem key={text} disablePadding>
//             <ListItemButton onClick={() => handleClick(text)} sx={{ color: 'black', 
//             backgroundColor: clickedButton === text ? 'rgba(255, 255, 255, 0.2)' : 'initial',
//             '&:hover': {
//               backgroundColor: clickedButton === text ? 'rgba(255, 255, 255, 0.2)' : 'white',
//             } }}>
//               <ListItemText primary={text} primaryTypographyProps={{ style: { color: 'black' } }} />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>
//     </Box>
//   );

//   return (
//     <Drawer variant="persistent" anchor="left" open={open} sx={{ top: '64px' }}>
//       {DrawerList}
//     </Drawer>
//   );
// };

import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

export const Sidebar = ({ propFunc, propArr, propBoolFunc, propBoolIn, onItemClick }) => {
  const [open, setOpen] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [filteredItems, setFilteredItems] = useState(propArr);
  const [clickedButton, setClickedButton] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setOpen(propBoolIn);
  }, [propBoolIn]);

  useEffect(() => {
    console.log('propArr:', propArr); // Debugging to verify the structure
    setFilteredItems(
      propArr.filter(item => {
        if (typeof item === 'string') {
          return item.toLowerCase().includes(filterText.toLowerCase());
        } else if (item && typeof item === 'object' && item.name) {
          return item.name.toLowerCase().includes(filterText.toLowerCase());
        }
        return false; // Skip if item is undefined or doesn't match expected structure
      })
    );
  }, [filterText, propArr]);

  const handleSideBarClose = () => {
    setOpen(false);
    propBoolFunc(false);
  };

  if (open === true) {
    propFunc(210);
  } else {
    propFunc(0);
  }

  const handleClick = (text) => {
    onItemClick(text);
    setClickedButton(text);
  };

  const DrawerList = (
    <Box sx={{ width: 200, height: '3000px', backgroundColor: 'rgb(253, 215, 52)', marginTop: 8, color: 'black' }} role="presentation">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px' }}>
        <Typography variant="h6" sx={{ color: 'black' }} />
        <IconButton onClick={handleSideBarClose} sx={{ color: 'black' }}>
          <CloseIcon />
        </IconButton>
      </div>

      <List>
        <TextField
          variant="outlined"
          margin="normal"
          fullWidth
          placeholder="　Filter items"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', borderRadius: 1, margin: '0 10px 10px 10px', width: '90%' }}
        />
        {filteredItems.map((item, index) => {
          const text = typeof item === 'string' ? item : item.name;
          const icon = typeof item !== 'string' && item.icon ? item.icon : null;

          return (
            <ListItem key={index} disablePadding>
              <ListItemButton
                onClick={() => handleClick(text)}
                sx={{
                  color: 'black',
                  backgroundColor: clickedButton === text ? 'rgba(255, 255, 255, 0.2)' : 'initial',
                  '&:hover': {
                    backgroundColor: clickedButton === text ? 'rgba(255, 255, 255, 0.2)' : 'white',
                  },
                }}
              >
                {icon && <Box sx={{ mr: 2 }}>{icon}</Box>} {/* Render icon if present */}
                <ListItemText primary={text} primaryTypographyProps={{ style: { color: 'black' } }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer variant="persistent" anchor="left" open={open} sx={{ top: '64px' }}>
      {DrawerList}
    </Drawer>
  );
};
