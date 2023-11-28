import React, { useContext, useEffect, useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { logoutUser } from '../actions';
import { useNavigate } from 'react-router-dom';
import { Store } from '../Store';
import { listOrders } from '../actions';
import { QrReader } from 'react-qr-reader'; // Change this line
import {
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
} from '@material-ui/core';
import { useStyles } from '../styles';
import { Alert } from '@material-ui/lab';
import Axios from 'axios';
import io from 'socket.io-client';

const WEB_URL = 'https://gimibar-new-c45af49f0979.herokuapp.com/';
const WEB_URL2 = 'http://localhost:4000';
const socket = io(WEB_URL); // Assuming your backend runs on port 4000

export default function AdminScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { orders, loading, error } = state.orderList;
  const { user } = state;

  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      console.log('No user info bruh');
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

  const [showScanner, setShowScanner] = useState(false); // State to toggle scanner visibility
  const [scannedOrderId, setScannedOrderId] = useState(null); // State to store scanned order ID

  // Handler for QR code scan
  const handleScan = (data) => {
    if (data) {
      setScannedOrderId(data);
      setShowScanner(false);
      // Logic to find order and call setOrderStateHandler
      const order = orders.find((o) => o._id === data);
      if (order) {
        setOrderStateHandler(order, 'deliver');
      }
    }
  };

  const handleError = (err) => {
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
    <Box className={[styles.root]}>
      <Drawer
        className={styles.drawer}
        variant="permanent"
        classes={{
          paper: styles.drawerPaper,
        }}
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
          style={{ width: '100%' }}
          facingMode={'environment'} // Use the back camera
        />
      )}
      <title>Admin Orders</title>

      <Box className={[styles.main]}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="Orders">
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell align="right">Price&nbsp;($)</TableCell>
                  <TableCell align="right">Count</TableCell>
                  <TableCell align="right">Items</TableCell>
                  <TableCell align="right">Type</TableCell>
                  <TableCell align="right">Payment</TableCell>
                  <TableCell align="right">State</TableCell>
                  <TableCell align="right">Password</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .filter((order) => order.isPaid)
                  .map((order) => (
                    <TableRow key={order.name}>
                      <TableCell component="th" scope="row">
                        {order.number}
                      </TableCell>
                      <TableCell align="right">${order.totalPrice}</TableCell>
                      <TableCell align="right">
                        {order.orderItems.length}
                      </TableCell>
                      <TableCell align="right">
                        {order.orderItems.map((item) => {
                          console.log(item);
                          return <Box>{`${item.name} x ${item.quantity}`}</Box>;
                        })}
                      </TableCell>
                      <TableCell align="right">{order.orderType}</TableCell>
                      <TableCell align="right">{order.paymentType}</TableCell>
                      <TableCell align="right">
                        {!order.isTaken && !order.isReady && !order.isDelivered
                          ? 'Not taken'
                          : order.inProgress
                          ? 'In Progress'
                          : order.isReady
                          ? 'Ready'
                          : order.isDelivered
                          ? 'Delivered'
                          : 'Unknown'}
                      </TableCell>
                      <TableCell align="right">{order.password}</TableCell>{' '}
                      <TableCell align="right">
                        {!order.isTaken ? (
                          <Button
                            variant="contained"
                            onClick={() => takeOrderHandler(order)}
                            color="primary"
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
                                color="secondary"
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
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
