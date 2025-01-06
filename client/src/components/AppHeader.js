import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import Link from "@mui/material/Link";
import { useEffect, useState } from "react";
import Service from "../service";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router'

const pages = [
  { title: "משימות", route: "/items" },
];

function AppHeader() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
 
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const navigate = useNavigate();
  const location = useLocation()

  const [loginUser, setLoginUser] = useState(null);
  useEffect(() => {
    console.log('render app header', loginUser)
    setLoginUser(Service.getLoginUser());
  }, [location.key]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            לוגו
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.title} onClick={handleCloseNavMenu}>
                  <Link style={{ textDecoration: "none" }} href={page.route}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </Link>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            לוגו
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {pages.map((page) => (
              <Link style={{ textDecoration: "none" }} href={page.route}>
                <Button
                  key={page.title}
                  onClick={handleCloseNavMenu}
                  sx={{ my: 2, color: "white", display: "block" }}
                >
                  {page.title}
                </Button>
              </Link>
            ))}
          </Box>

          {loginUser ? (
            <div>
              {loginUser.name} מחובר | 
              <Button color="inherit" onClick={()=>{
                Service.logout();
                navigate('/')
              }}>התנתקות</Button>
            </div>
          ) : (
            <div>
            <Button color="inherit" onClick={()=>{
                navigate('/login')
              }}>התחברות</Button>
            </div>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default AppHeader;
// const pages = [
//   { title: "משימות", route: "/items" },
// ];

// function AppHeader() {
// const [anchorElNav, setAnchorElNav] = React.useState(null);

// const handleOpenNavMenu = (event) => {
//   setAnchorElNav(event.currentTarget);
// };

// const handleCloseNavMenu = () => {
//   setAnchorElNav(null);
// };

// const navigate = useNavigate();
// const location = useLocation();

// const [loginUser, setLoginUser] = useState(null);
// useEffect(() => {
//   setLoginUser(service.getLoginUser());
// }, [location.key]);

// return (
//   <AppBar position="static" sx={{ backgroundColor: '#222', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.5)' }}>
//     <Container maxWidth="xl">
//       <Toolbar disableGutters>
//         <Typography
//           variant="h6"
//           noWrap
//           component="div"
//           sx={{
//             flexGrow: 1,
//             display: { xs: "flex", md: "flex" },
//             fontFamily: "monospace",
//             fontWeight: 700,
//             letterSpacing: ".2rem",
//             color: "#FFDD44",
//             textDecoration: "none",
//             fontSize: '28px',
//             transition: 'transform 0.3s',
//             '&:hover': {
//               transform: 'scale(1.1)',
//             }
//           }}
//         >
//           בית
//         </Typography>

//         <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, gap: 2 }}>
//           {pages.map((page) => (
//             <Link key={page.title} style={{ textDecoration: "none" }} href={page.route}>

//             {/* <Link style={{ textDecoration: "none" }} href={page.route}> */}
//               <Button
//                 key={page.title}
//                onClick={handleCloseNavMenu}
//                 sx={{
//                   my: 2,
//                   color: "#FFDD44",
//                   padding: '12px 20px',
//                   borderRadius: '20px',
//                   backgroundColor: 'rgba(255, 221, 68, 0.1)',
//                   transition: 'background-color 0.3s, transform 0.3s',
//                   '&:hover': {
//                     backgroundColor: 'rgba(255, 221, 68, 0.2)',
//                     transform: 'scale(1.05)',
//                   }
//                 }}
//               >
//                 {page.title}
//               </Button>
//             </Link>
//           ))}
//         </Box>

//         <Box sx={{ flexGrow: 0 }}>
//           {loginUser ? (
//             <div style={{ display: 'flex', alignItems: 'center', color: '#FFDD44' }}>
//               {loginUser.name} מחובר | 
//               <Button 
//                 color="inherit" 
//                 onClick={() => {
//                   service.logout();
//                   navigate('/');
//                 }}
//                 sx={{ ml: 2, color: '#FFDD44', transition: 'color 0.3s', '&:hover': { color: '#FFAA33' }}}
//               >
//                 התנתקות
//               </Button>
//             </div>
//           ) : (
//             <Button 
//               color="inherit" 
//               onClick={() => {
//                 navigate('/login');
//               }}
//               sx={{ color: '#FFDD44', '&:hover': { color: '#FFAA33' }}}
//             >
//               התחברות
//             </Button>
//           )}
//         </Box>

//         <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
//           <IconButton
//             size="large"
//             aria-label="account of current user"
//             aria-controls="menu-appbar"
//             aria-haspopup="true"
//             onClick={handleOpenNavMenu}
//             color="inherit"
//           >
//             <MenuIcon />
//           </IconButton>
//           <Menu
//             id="menu-appbar"
//             anchorEl={anchorElNav}
//             anchorOrigin={{
//               vertical: "bottom",
//               horizontal: "left",
//             }}
//             keepMounted
//             transformOrigin={{
//               vertical: "top",
//               horizontal: "left",
//             }}
//             open={Boolean(anchorElNav)}
//             onClose={handleCloseNavMenu}
//             sx={{
//               display: { xs: "block", md: "none" },
//             }}
//           >
//             {pages.map((page) => (
//               <MenuItem key={page.title} onClick={handleCloseNavMenu}>
//                 <Link style={{ textDecoration: "none" }} href={page.route}>
//                   <Typography textAlign="center" sx={{ color: '#444' }}>{page.title}</Typography>
//                 </Link>
//               </MenuItem>
//             ))}
//           </Menu>
//         </Box>
//       </Toolbar>
//     </Container>
//   </AppBar>
// );
// }
// export default AppHeader;
