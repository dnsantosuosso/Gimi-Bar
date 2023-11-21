import React, { useContext, useEffect, useState } from 'react';
import { Store } from '../Store';
import {
  addToOrder,
  removeAllItemsFromOrder,
  removeFromOrder,
} from '../actions';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Dialog,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import AddIcon from '@material-ui/icons/Add';
import { Navigate, useNavigate } from 'react-router-dom';
import RemoveIcon from '@material-ui/icons/Remove';
import { useStyles } from '../styles';
import Logo from '../Components/Logo';
export default function ReviewScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { orderItems, itemsCount, totalPrice, taxPrice } = state.order;
  const [serviceFee, setServiceFee] = useState(0); // Service fee set to 0 by defaults
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [product, setProduct] = useState({});
  const totalAmountBeforeTaxes = orderItems.reduce((acc, orderItem) => {
    return acc + orderItem.price * orderItem.quantity;
  }, 0);

  const closeHandler = () => {
    setIsOpen(false);
  };
  const navigate = useNavigate();
  const productClickHandler = (p) => {
    setProduct(p);
    setIsOpen(true);
  };

  // Convert orderItems array to a dictionary object with product names as keys and quantities as values.
  //Duplicate code: TODO Fix
  const initialQuantities = state.order.orderItems.reduce((acc, item) => {
    acc[item.name] = item.quantity; // If you have unique IDs for products, use them instead of names.
    return acc;
  }, {});
  //Duplicate code: TODO Fix
  const [quantities, setQuantities] = useState(initialQuantities);

  //Duplicate code: TODO Fix
  const payOrderHandler = async () => {
    const savedOrder = await saveOrder(state.order.orderItems);
    if (savedOrder && savedOrder._id) {
      handlePayment(state.order.orderItems, savedOrder._id);
    } else {
      console.error('Failed to obtain saved order ID.');
    }
  };

  //Duplicate Code: TODO FIX
  async function saveOrder(orderItems) {
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        //TODO: Hardcode bar id for now
        body: JSON.stringify({
          orderType: state.order.orderType,
          paymentType: state.order.paymentType,
          orderItems: orderItems,
          isPaid: false,
          inProgress: false,
          bar: '650b2828e8091b27f8cc1a6d', //Hardcoded
          password: generateRandomPassword(),
          totalPrice: totalPrice,
        }),
      });
      if (response.ok) {
        console.log(state.order.orderType);
        console.log(state.order.paymentType);
        console.log(orderItems);
        console.log(totalPrice);
        console.log(state);
        return response.json();
      } else {
        throw new Error('Failed to save order.');
      }
    } catch (error) {
      console.error('Error while saving order:', error);
    }
  }

  //Duplicate Code: TODO FIX
  function generateRandomPassword(length = 4) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    console.log("We've made a password " + password);

    return password;
  }

  //Duplicate code: TODO FIX
  async function handlePayment(orderItems, orderId) {
    try {
      const response = await fetch('/api/stripe/create-payment-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderItems, orderId }),
      });

      const data = await response.json();

      // Check if there's an error message in the response
      if (data.message) {
        throw new Error(data.message);
      }

      // Redirect the user to Stripe's payment page
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating payment link:', error);
    }
  }

  const addToOrderHandler = () => {
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
  };
  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    setIsOpen(false);
  };
  const procedToCheckoutHandler = () => {
    // procedToCheckout(dispatch);
    navigate('/select-payment');
  };
  useEffect(() => {}, []);

  return (
    <Box className={[styles.root]}>
      <Box className={[styles.main, styles.center]}>
        <Box className={[styles.center, styles.column]}>
          <Logo large></Logo>
          <Typography
            gutterBottom
            className={styles.title}
            variant="h3"
            component="h3"
          >
            Review my order
          </Typography>
        </Box>

        <Grid container className={styles.productsContainer}>
          {orderItems.map((orderItem) => (
            <Grid item md={12} key={orderItem.name}>
              <Card elevation={0} className={styles.cardrect}>
                <CardActionArea>
                  <CardContent
                    style={{
                      display: 'flex',
                      flexDirection: 'column',

                      flexGrow: 1,
                    }}
                  >
                    {/* Product Details Container */}
                    <Box
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'flex-start', // Adjust the alignment
                        marginLeft: '22px',
                        flexGrow: 1,
                      }}
                    >
                      {/* Product Name, Image */}
                      <Box
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginBottom: '8px',
                        }}
                      >
                        {/* Product Image */}

                        <img
                          style={{
                            position: 'absolute',
                            top: '50%',
                            height: '40px',
                            width: '40px',
                            objectFit: 'contain',
                            transform: 'translate(-50%, -50%)',
                          }}
                          src={orderItem.image}
                          alt={orderItem.name}
                          className={styles.mediasmall}
                        />

                        <Typography
                          variant="body2"
                          color="textPrimary"
                          component="p"
                          style={{ marginLeft: '45px' }} // Add some margin to the left
                        >
                          {orderItem.name}
                        </Typography>

                        <div className={styles.rightAlignedContainer}>
                          <Box className={[styles.row, styles.center]}>
                            <Button
                              variant="contained"
                              color="primary"
                              className={styles.smallbuttonsquared}
                              disabled={
                                quantities[orderItem.name] === 0 ||
                                !quantities[orderItem.name]
                              }
                              onClick={(e) => {
                                const currentQuantity =
                                  quantities[orderItem.name] || 1;
                                if (currentQuantity >= 1) {
                                  setQuantities({
                                    ...quantities,
                                    [orderItem.name]: currentQuantity - 1,
                                  });

                                  removeFromOrder(dispatch, {
                                    ...orderItem,
                                    quantity: currentQuantity - 1,
                                  });
                                }
                              }}
                            >
                              <RemoveIcon />
                            </Button>

                            <TextField
                              inputProps={{ className: styles.largeInput }}
                              InputProps={{
                                bar: true,
                                inputProps: {
                                  className: styles.largeInput,
                                },
                              }}
                              className={styles.centerTextInput}
                              style={{
                                width: `${
                                  quantities.hasOwnProperty(orderItem.name) &&
                                  String(quantities[orderItem.name]).length > 1
                                    ? 60
                                    : 40
                                }px`,
                              }}
                              type="number"
                              variant="filled"
                              min={0}
                              value={
                                quantities.hasOwnProperty(orderItem.name)
                                  ? quantities[orderItem.name]
                                  : 0
                              }
                            />

                            <Button
                              variant="contained"
                              color="primary"
                              className={styles.smallbuttonsquared}
                              onClick={(e) => {
                                const currentQuantity =
                                  (quantities[orderItem.name] || 0) + 1;
                                setQuantities({
                                  ...quantities,
                                  [orderItem.name]: currentQuantity,
                                });

                                addToOrder(dispatch, {
                                  ...orderItem,
                                  quantity: currentQuantity,
                                });
                              }}
                            >
                              <AddIcon />
                            </Button>
                          </Box>
                        </div>

                        {/* <Button variant="contained">Edit</Button> */}
                      </Box>

                      {/* Calories and Price */}
                      <Box
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                          style={{ marginLeft: '45px' }} // Add some margin to the left
                        >
                          {orderItem.calories} Cal
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textPrimary"
                          component="p"
                        >
                          {orderItem.quantity} x ${orderItem.price} = $
                          {(orderItem.quantity * orderItem.price).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
          {/* Price Breakdown Section */}
          <Grid item md={12}>
            <Divider style={{ margin: '8px 0' }} />

            <Box
              className={[styles.smallSpace]}
              style={{ color: 'black', textAlign: 'right' }}
            >
              <strong>SubTotal:</strong> ${totalAmountBeforeTaxes.toFixed(2)}
            </Box>
            <Box
              className={[styles.smallSpace]}
              style={{ color: 'black', textAlign: 'right' }}
            >
              <strong>Tax:</strong> ${taxPrice.toFixed(2)}
            </Box>
            <Box
              className={[styles.smallSpace]}
              style={{ color: 'black', textAlign: 'right' }}
            >
              <strong>Service Fee:</strong> $0.00
            </Box>
            <Box
              className={[styles.smallSpace]}
              style={{ color: 'black', textAlign: 'right' }}
            >
              <strong>Total:</strong> $
              {(totalAmountBeforeTaxes + taxPrice).toFixed(2)}
            </Box>
          </Grid>
        </Grid>
      </Box>
      <Box>
        <Box>
          <Box className={[styles.bordered, styles.space]}>
            My Order | Tax: ${taxPrice} | Total: ${totalPrice} | Items:{' '}
            {itemsCount}
          </Box>
          <Box className={[styles.row, styles.around]}>
            <Button
              onClick={() => {
                navigate(`/order`);
              }}
              variant="contained"
              color="primary"
              className={styles.largeButton}
            >
              Back
            </Button>

            <Button
              onClick={payOrderHandler}
              variant="contained"
              color="secondary"
              disabled={orderItems.length === 0}
              className={styles.largeButton}
            >
              Proceed To Checkout
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
