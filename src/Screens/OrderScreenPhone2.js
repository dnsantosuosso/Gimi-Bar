import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Typography,
  CardActionArea,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Divider,
} from '@material-ui/core';
//Dialog Code
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import MenuIcon from '@material-ui/icons/Menu';
import Drawer from '@material-ui/core/Drawer';

import { Tabs, Tab } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { Navigate, useNavigate } from 'react-router-dom';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useContext, useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import {
  listCategories,
  listProducts,
  addToOrder,
  clearOrder,
  removeFromOrder,
} from '../actions';
import data from '../data';
import { useStyles } from '../styles';
import { Store } from '../Store';
import Logo from '../Components/Logo';
import { Label } from '@material-ui/icons';
import { LOAD_SAVED_ORDER_ITEMS } from '../constants';

export default function OrderScreen(props) {
  const { categories } = data;
  const styles = useStyles();
  const [categoryName, setCategoryName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);

  const [searchTerm, setSearchTerm] = useState('');

  const [isOpen, setIsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [product, setProduct] = useState({});

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleOpenDialog = (product) => {
    setSelectedProduct(product);
    setOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };
  const { state, dispatch } = useContext(Store);

  // Convert orderItems array to a dictionary object with product names as keys and quantities as values.
  const initialQuantities = state.order.orderItems.reduce((acc, item) => {
    acc[item.name] = item.quantity; // If you have unique IDs for products, use them instead of names.
    return acc;
  }, {});

  const [quantities, setQuantities] = useState(initialQuantities);

  //const { categories, loading, error } = state.categoryList;
  const {
    products,
    loading: loadingProducts,
    error: errorProducts,
  } = state.productList;

  const navigate = useNavigate();

  const { orderItems, itemsCount, totalPrice, taxPrice } = state.order;

  const payOrderHandler = async () => {
    const savedOrder = await saveOrder(state.order.orderItems);
    console.log('SAVED ORDER IS' + savedOrder);
    if ((await savedOrder) && (await savedOrder._id)) {
      handlePayment(state.order.orderItems, savedOrder._id);
    } else {
      console.error('Failed to obtain saved order ID.');
    }
  };

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
        return response.json();
      } else {
        throw new Error('Failed to save order.');
      }
    } catch (error) {
      console.error('Error while saving order:', error);
    }
  }

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

  //Search Function
  const filteredProducts = searchTerm
    ? products
        .filter(
          (product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (product.category &&
              product.category
                .toLowerCase()
                .includes(searchTerm.toLowerCase())) ||
            (product.description &&
              product.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()))
        )
        .sort((a, b) => {
          // Prioritize name matches over category or description matches
          const aNameMatch = a.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
          const bNameMatch = b.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

          if (aNameMatch && !bNameMatch) {
            return -1; // a comes before b
          }
          if (!aNameMatch && bNameMatch) {
            return 1; // b comes before a
          }
          return 0; // no change in order
        })
    : products;

  useEffect(() => {
    if (!categories) {
      listCategories(dispatch);
    } else {
      listProducts(dispatch, categoryName);
    }
  }, [dispatch, categories, categoryName]);

  //Attempt to use sessionStorage, but doesn't work because there is a full page refresh. Solution=create our own payment screen
  useEffect(() => {
    const savedOrderItems = sessionStorage.getItem('orderItems');
    if (savedOrderItems) {
      dispatch({
        type: LOAD_SAVED_ORDER_ITEMS,
        payload: JSON.parse(savedOrderItems),
      });
    }
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem('orderItems', JSON.stringify(orderItems));
  }, [orderItems]);

  const categoryClickHandler = (name) => {
    setCategoryName(name);
    setSearchTerm(''); // clear the search term
    listProducts(dispatch, name);
  };

  const productClickHandler = (p) => {
    setProduct(p);
    setIsOpen(true);
  };
  const addToOrderHandler = () => {
    console.log(product.name);
    console.log(quantity);
    // Save the temporary quantity value to the quantities object
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product.name]: quantity, // use product.id if you have unique IDs
    }));
    addToOrder(dispatch, { ...product, quantity });
    setIsOpen(false);
  };

  const cancelOrRemoveFromOrder = () => {
    removeFromOrder(dispatch, product);
    // Reset the quantity of this product in the quantities object
    setQuantities((prevQuantities) => {
      const updatedQuantities = { ...prevQuantities };
      delete updatedQuantities[product.name]; // use product.id if you have unique IDs
      return updatedQuantities;
    });
    setIsOpen(false);
  };

  return (
    <Box className={styles.root}>
      {/* Grid container for overall layout */}
      <Grid
        container
        alignItems="center"
        spacing={1}
        className={styles.responsiveGridItem}
      >
        {/* Logo */}
        <Grid item xs={4}>
          <Box>
            <Logo className={styles.logo} />
          </Box>
        </Grid>

        {/* Search Bar */}
        <Grid item xs={8}>
          <Box className={styles.searchBox}>
            <IconButton>
              <SearchIcon />
            </IconButton>
            <TextField
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              variant="outlined"
              size="small"
            />
          </Box>
        </Grid>
      </Grid>

      {/* Tabs for navigation */}
      <Grid item xs={12}>
        {/* ...Tabs Component... */}
        <Tabs
          value={activeTab}
          onChange={(event, newValue) => {
            setActiveTab(newValue);
            if (newValue === 0) {
              categoryClickHandler('');
            } else {
              categoryClickHandler(categories[newValue - 1].name);
            }
          }}
          centered
          variant="scrollable"
          scrollButtons="auto"
          classes={{ indicator: styles.tabIndicator }}
        >
          <Tab
            classes={{
              root: styles.customTabRoot,
              selected: styles.selectedTab,
              textColorInherit: styles.unselectedTab,
            }}
            label="Main Menu"
          />
          {categories.map((category, index) => (
            <Tab
              key={index}
              classes={{
                root: styles.customTabRoot,
                selected: styles.selectedTab,
                textColorInherit: styles.unselectedTab,
              }}
              label={category.name}
            />
          ))}
        </Tabs>
      </Grid>

      <Box className={styles.main}>
        <Grid
          container
          alignItems="center"
          className={styles.responsiveGridItem}
        >
          {/* Product Content */}
          <Grid item xs={12}>
            <Grid container spacing={3} className={styles.productsContainer}>
              {loadingProducts ? (
                <CircularProgress />
              ) : errorProducts ? (
                <Alert severity="error">{errorProducts}</Alert>
              ) : (
                Array.isArray(filteredProducts) &&
                filteredProducts.map((product) => (
                  <Grid item xs={12} key={product.id}>
                    {' '}
                    {/* Responsive grid sizing */}
                    <Card className={styles.borderlessCard}>
                      {/* Static Container that contains the product card*/}
                      <div
                        onClick={() => handleOpenDialog(product)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                        }}
                      >
                        {/* Image */}
                        <CardActionArea
                          style={{ width: '40px', marginRight: '16px' }}
                        >
                          <CardMedia
                            component="img"
                            alt={product.name}
                            image={product.image}
                            style={{
                              height: '40px',
                              width: '40px',
                              objectFit: 'contain',
                            }}
                          />
                        </CardActionArea>

                        {/* Name */}
                        <Typography
                          gutterBottom
                          variant="body2"
                          color="textPrimary"
                          component="p"
                          style={{ width: '80px', marginRight: '16px' }}
                        >
                          {product.name}
                        </Typography>

                        {/* Price */}
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                          style={{ marginRight: '16px', width: '100px' }}
                        >
                          ${product.price}
                        </Typography>

                        <Box
                          className={[
                            styles.row,
                            styles.center,
                            styles.rightAlignedContainer,
                          ]}
                          style={{ width: '100px' }} //Change this width to have elements closer or farther apart in the screen
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            className={styles.smallbuttonsquared}
                            disabled={
                              quantities[product.name] === 0 ||
                              !quantities[product.name]
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentQuantity =
                                quantities[product.name] || 1;
                              if ((currentQuantity) => 1) {
                                setQuantities({
                                  ...quantities,
                                  [product.name]: currentQuantity - 1,
                                });

                                // Remove one quantity of the product from the order.
                                removeFromOrder(dispatch, {
                                  ...product,
                                  quantity: currentQuantity - 1,
                                });
                                console.log('ITEMS COUNT' + itemsCount);
                              }
                            }}
                          >
                            <RemoveIcon />
                          </Button>
                          <Typography
                            className={styles.quantityLabel}
                            onClick={(e) => {
                              e.stopPropagation(); // Prevents the dialog from opening when the quantity label is clicked
                            }}
                          >
                            {quantities[product.name] || 0}
                          </Typography>

                          <Button
                            variant="contained"
                            color="primary"
                            className={styles.smallbuttonsquared}
                            onClick={(e) => {
                              e.stopPropagation();
                              const currentQuantity =
                                (quantities[product.name] || 0) + 1;
                              setQuantities({
                                ...quantities,
                                [product.name]: currentQuantity,
                              });

                              // Immediately add to the order.
                              addToOrder(dispatch, {
                                ...product,
                                quantity: currentQuantity,
                              });
                            }}
                          >
                            <AddIcon />
                          </Button>
                        </Box>
                      </div>
                    </Card>
                  </Grid>
                ))
              )}
              <div style={{ height: '220px' }}></div>{' '}
            </Grid>
            <Dialog
              open={open}
              onClose={() => setOpen(false)}
              style={{ maxWidth: '350px', margin: '0 auto' }}
            >
              <DialogTitle style={{ textAlign: 'center' }}>
                {selectedProduct?.name}
              </DialogTitle>
              <DialogContent>
                <CardMedia
                  component="img"
                  alt={selectedProduct?.name}
                  image={selectedProduct?.image}
                  style={{
                    height: '100px',
                    width: '100px',
                    objectFit: 'contain',
                    margin: 'auto',
                  }}
                />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  style={{ textAlign: 'center' }}
                >
                  {selectedProduct?.alcohol}% Alc. - {selectedProduct?.calories}{' '}
                  Cal
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  style={{ marginTop: '24px', marginBottom: '24px' }}
                >
                  {selectedProduct?.description}
                </Typography>
                <Box
                  className={[styles.row, styles.center]}
                  style={{
                    width: '220px',
                    margin: 'auto',
                    marginBottom: '24px',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.smallbuttonsquared}
                    disabled={
                      quantities[selectedProduct?.name] === 0 ||
                      !quantities[selectedProduct?.name]
                    }
                    onClick={(e) => {
                      const currentQuantity =
                        quantities[selectedProduct?.name] || 1;
                      if ((currentQuantity) => 1) {
                        setQuantities({
                          ...quantities,
                          [selectedProduct?.name]: currentQuantity - 1,
                        });

                        // Remove one quantity of the product from the order.
                        removeFromOrder(dispatch, {
                          ...selectedProduct,
                          quantity: currentQuantity - 1,
                        });
                        console.log('ITEMS COUNT' + itemsCount);
                      }
                    }}
                  >
                    <RemoveIcon />
                  </Button>

                  <Typography
                    className={styles.quantityLabel}
                    // style adjustments if necessary
                  >
                    {quantities[selectedProduct?.name] || 0}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    className={styles.smallbuttonsquared}
                    onClick={(e) => {
                      const currentQuantity =
                        (quantities[selectedProduct?.name] || 0) + 1;
                      setQuantities({
                        ...quantities,
                        [selectedProduct?.name]: currentQuantity,
                      });

                      // Immediately add to the order.
                      addToOrder(dispatch, {
                        ...selectedProduct,
                        quantity: currentQuantity,
                      });
                    }}
                  >
                    <AddIcon />
                  </Button>
                </Box>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </Box>
      <Box className={styles.bottomContainer}>
        {/* Conditional rendering based on itemsCount */}
        {itemsCount !== 0 && (
          <Box
            className={[styles.bordered]}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <Typography variant="body2" style={{ paddingLeft: '16px' }}>
              Total: ${totalPrice || 0} | Tax: ${taxPrice || 0} | Items:{' '}
              {itemsCount || 0}
            </Typography>

            <IconButton
              onClick={() => navigate('/review')}
              className={styles.smallButton}
            >
              <ShoppingCartIcon />
            </IconButton>
          </Box>
        )}

        <Box className={[styles.row, styles.around]}>
          <Button
            onClick={() => {
              clearOrder(dispatch);
              navigate('/');
            }}
            variant="contained"
            className={styles.largeButton}
          >
            Cancel
          </Button>

          <Button
            onClick={payOrderHandler}
            variant="contained"
            disabled={orderItems.length === 0}
            className={styles.largeButton}
          >
            Pay
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
