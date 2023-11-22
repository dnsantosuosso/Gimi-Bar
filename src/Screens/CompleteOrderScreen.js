import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { useStyles } from '../styles';
import Logo from '../Components/Logo';
import { Store } from '../Store';
import { Alert } from '@material-ui/lab';
import { useNavigate } from 'react-router-dom';
export default function CompleteOrderScreen(props) {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const { order } = state;
  const { loading, error, newOrder } = state.orderCreate;
  const navigate = useNavigate();

  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState(null);

  // State to store the fetched order
  const [fetchedOrder, setFetchedOrder] = useState(null);

  // Extract orderId from the URL
  const orderId = new URLSearchParams(window.location.search).get('orderId');

  useEffect(() => {
    const fetchOrderAndUpdate = async () => {
      try {
        setLocalLoading(true);
        // Fetch the order by its orderId
        const response = await fetch(`/api/orders/${orderId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Include a body if needed for your POST request
        });

        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        if (data) {
          setFetchedOrder(data);

          // Update the order to set isPaid and inProgress
          const updateResponse = await fetch(`/api/orders/action/${orderId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ action: 'paid' }),
          });

          const updateData = await updateResponse.json();
          if (updateData.message !== 'Done') {
            throw new Error(updateData.message);
          }
          setLocalLoading(false);
        }
      } catch (error) {
        console.error('Error fetching and updating order:', error);
        setLocalError(error.message);
        setLocalLoading(false);
      }
    };

    if (orderId) {
      fetchOrderAndUpdate();
    }
  }, [orderId]);

  return (
    <Box className={[styles.root, styles.main]}>
      <Box className={styles.logoTop}>
        <Logo large className={styles.logoTop}></Logo>
      </Box>
      <Box className={[styles.main, styles.center]}>
        <Box>
          {localLoading ? (
            <CircularProgress></CircularProgress>
          ) : localError ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <>
              <Typography
                gutterBottom
                className={styles.subtitle}
                variant="h3"
                component="h3"
              >
                Thank you! Your order has been placed
              </Typography>
              <Typography
                gutterBottom
                className={styles.subtitle}
                variant="h4"
                component="h4"
              >
                Your order number is:{' '}
                <span className={styles.passwordText}>
                  <strong>{fetchedOrder?.number}</strong>
                </span>
              </Typography>
              <Typography
                gutterBottom
                className={styles.subtitle}
                variant="h4"
                component="h4"
              >
                Show this password to the server:{' '}
                <span className={styles.passwordText}>
                  <strong>{fetchedOrder?.password}</strong>
                </span>
              </Typography>
            </>
          )}
        </Box>
      </Box>
      <Box className={[styles.center, styles.space]}>
        <Button
          onClick={() => {
            navigate('/');
            window.location.reload();
          }}
          variant="contained"
          className={styles.largeButton}
        >
          Order Again
        </Button>
      </Box>
    </Box>
  );
}
