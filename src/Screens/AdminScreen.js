import React, { useContext, useEffect, useState } from 'react';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';

import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import Logo from '../Components/Logo';
import { useStyles } from '../styles';
import MenuIcon from '@material-ui/icons/Menu';
import { Alert } from '@material-ui/lab';
import { QrReader } from 'react-qr-reader';
import Axios from 'axios';
import io from 'socket.io-client';
import { logoutUser, listOrders } from '../actions';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';

const WEB_URL = 'https://gimibar-new-c45af49f0979.herokuapp.com/';
const socket = io(WEB_URL);

export default function AdminScreen(props) {
  const styles = useStyles();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const { state, dispatch } = useContext(Store);
  const { orders, loading, error } = state.orderList;
  const { user } = state;
  const navigate = useNavigate();

  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!user.isAdmin) {
      console.error('User is not an admin');
      navigate('/');
      return;
    }

    listOrders(dispatch);

    socket.on('orderUpdated', () => {
      console.log('Received order');
      listOrders(dispatch);
    });

    return () => {
      socket.off('orderUpdated');
    };
  }, [dispatch, navigate, user]);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleExpandClick = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const [showScanner, setShowScanner] = useState(false);
  const [scannedOrderId, setScannedOrderId] = useState(null);

  // Handler for QR code scan
  const handleScan = (data) => {
    console.log('We scanned');
    if (data) {
      setScannedOrderId(data); //will be order's ID
      setShowScanner(false);
      // Logic to find order and call setOrderStateHandler
      const order = orders.find((o) => o._id === scannedOrderId);
      if (order) {
        setOrderStateHandler(order, 'deliver');
      }
    }
  };

  const handleError = (err) => {
    console.log('We cannot scan');
    console.error(err);
  };

  const toggleScanner = () => {
    setShowScanner(!showScanner);
  };

  const setOrderStateHandler = async (order, action) => {
    try {
      await Axios.post('/api/orders/action/' + order._id, { action: action });
      listOrders(dispatch);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = async () => {
    await logoutUser(dispatch);
    navigate('/login');
  };

  const takeOrderHandler = async (order) => {
    try {
      await Axios.post('/api/orders/' + order._id + '/take', {
        //TODO make put
        userId: user._id, // passing the user's ID in the request body
      });
      listOrders(dispatch);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleMenu = async () => {
    //go to menu screen
  };

  return (
    <Box className={styles.root}>
      {isMobile && (
        <AppBar position="static" className={styles.appBarMobile}>
          <Toolbar className={styles.appBarMobile}>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
            <Box>
              <Logo className={styles.logo} />
            </Box>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        classes={{ paper: styles.drawerPaper }}
      >
        <List>
          <Divider />
          <ListItem button onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItem>
          <ListItem button onClick={toggleScanner}>
            <ListItemText
              primary={showScanner ? 'Hide Scanner' : 'Scan Order'}
            />
          </ListItem>

          {/* <ListItem button onClick={handleMenu}>
            <ListItemText primary="Edit Menu" />
          </ListItem> */}
        </List>
      </Drawer>

      {showScanner && (
        <QrReader
          delay={300}
          onError={handleError}
          onScan={handleScan}
          style={{ width: isMobile ? '100%' : 'auto' }}
          constraints={{ facingMode: 'environment' }}
        />
      )}

      <Box className={styles.main}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="Orders">
              <TableHead>
                <TableRow>
                  <TableCell className={isMobile ? styles.mobileTableCell : ''}>
                    <strong>Order#</strong>
                  </TableCell>
                  {!isMobile && (
                    <TableCell
                      className={isMobile ? styles.mobileTableCell : ''}
                      align="right"
                    >
                      <strong>Price&nbsp;($)</strong>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell align="right">
                      <strong>Count</strong>
                    </TableCell>
                  )}
                  <TableCell
                    className={isMobile ? styles.mobileTableCell : ''}
                    align="right"
                  >
                    <strong>Items</strong>
                  </TableCell>
                  {!isMobile && (
                    <TableCell align="right">
                      <strong>Type</strong>
                    </TableCell>
                  )}
                  {!isMobile && (
                    <TableCell align="right">
                      <strong>Payment</strong>
                    </TableCell>
                  )}
                  <TableCell
                    className={isMobile ? styles.mobileTableCell : ''}
                    align="right"
                  >
                    <strong>Password</strong>
                  </TableCell>
                  <TableCell
                    className={isMobile ? styles.mobileTableCell : ''}
                    align="right"
                  >
                    <strong>Actions</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .filter((order) => order.isPaid)
                  .map((order) => (
                    <React.Fragment key={order._id}>
                      <TableRow>
                        <TableCell
                          className={isMobile ? styles.mobileTableCell : ''}
                          component="th"
                          scope="row"
                        >
                          {order.number}
                        </TableCell>
                        {!isMobile && (
                          <TableCell align="right">
                            ${order.totalPrice}
                          </TableCell>
                        )}
                        {!isMobile && (
                          <TableCell align="right">
                            {order.orderItems.length}
                          </TableCell>
                        )}
                        <TableCell align="right">
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'flex-end',
                            }}
                          >
                            {/* Display the first two items */}
                            {order.orderItems.slice(0, 2).map((item, index) => (
                              <div key={index} style={{ marginBottom: '8px' }}>
                                {`${item.name} x ${item.quantity}`}
                              </div>
                            ))}

                            {/* Collapse container for additional items */}
                            <Collapse
                              in={expandedOrderId === order._id}
                              timeout="auto"
                              unmountOnExit
                            >
                              {order.orderItems.slice(2).map((item, index) => (
                                <div
                                  key={index}
                                  style={{ marginBottom: '8px' }}
                                >
                                  {`${item.name} x ${item.quantity}`}
                                </div>
                              ))}
                            </Collapse>

                            {/* Container for the button to expand and view more items if there are more than two */}
                            {order.orderItems.length > 2 && (
                              <div
                                style={{
                                  display: 'flex', // make this a flex container
                                  justifyContent: 'right', // right horizontally
                                  alignItems: 'center', // center vertically
                                  width: '100%', // take full width to center content within the TableCell
                                  marginTop: '8px',
                                }}
                              >
                                <IconButton
                                  size="small"
                                  onClick={() => handleExpandClick(order._id)}
                                >
                                  {expandedOrderId === order._id ? (
                                    <ExpandLess />
                                  ) : (
                                    <ExpandMore />
                                  )}
                                </IconButton>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {!isMobile && (
                          <TableCell align="right">{order.orderType}</TableCell>
                        )}
                        {!isMobile && (
                          <TableCell align="right">
                            {order.paymentType}
                          </TableCell>
                        )}
                        <TableCell align="right">{order.password}</TableCell>
                        <TableCell align="right">
                          {/* Action buttons and logic */}
                          {!order.isTaken ? (
                            <Button
                              variant="contained"
                              onClick={() => takeOrderHandler(order)}
                              className={`${styles.primary} ${
                                isMobile
                                  ? styles.uniformButtonMobile
                                  : styles.uniformButton
                              }`}
                            >
                              Take
                            </Button>
                          ) : order.takenBy === user._id ? (
                            <>
                              {order.isPaid && !order.isReady && (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    setOrderStateHandler(order, 'ready')
                                  }
                                  className={`${styles.secondary} ${
                                    isMobile
                                      ? styles.uniformButtonMobile
                                      : styles.uniformButton
                                  }`}
                                >
                                  Ready
                                </Button>
                              )}
                              {order.isReady && !order.isDelivered && (
                                <Button
                                  variant="contained"
                                  onClick={() =>
                                    setOrderStateHandler(order, 'deliver')
                                  }
                                  className={`${styles.tertiary} ${
                                    isMobile
                                      ? styles.uniformButtonMobile
                                      : styles.uniformButton
                                  }`}
                                >
                                  Deliver
                                </Button>
                              )}
                            </>
                          ) : (
                            <span>Taken</span>
                          )}
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
