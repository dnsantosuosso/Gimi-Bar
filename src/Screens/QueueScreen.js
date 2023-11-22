import React, { useContext, useEffect } from 'react';
import { Store } from '../Store';
import { listQueue } from '../actions';
import {
  Box,
  CircularProgress,
  Grid,
  List,
  ListItem,
  Paper,
} from '@material-ui/core';
import { useStyles } from '../styles';
import { Alert } from '@material-ui/lab';
import io from 'socket.io-client';

const WEB_URL = 'https://gimibar-new-c45af49f0979.herokuapp.com/';
const WEB_URL2 = 'http://localhost:3000';
const socket = io(WEB_URL2); // Assuming your backend runs on port 4000
export default function QueueScreen(props) {
  const styles = useStyles();

  const { state, dispatch } = useContext(Store);
  const { queue, loading, error } = state.queueList;

  useEffect(() => {
    // Fetch the initial queue
    listQueue(dispatch);

    //Set up the real-time queue update listener
    socket.on('queueUpdated', () => {
      listQueue(dispatch);
    });

    // Clean up the socket connection when the component unmounts
    return () => {
      socket.off('queueUpdated');
    };
  }, []);

  return (
    <Box
      className={[styles.root]}
      style={{ backgroundColor: 'black', padding: '0 20px' }}
    >
      <title>Queue</title>
      <Box className={[styles.main]}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={2}>
            <Grid item md={6}>
              <Paper style={{ margin: '20px', backgroundColor: '#000000' }}>
                <h1
                  className={styles.processing}
                  style={{ textAlign: 'center' }}
                >
                  In Progress
                </h1>
                <List>
                  {queue.inProgressOrders.map((order) => (
                    <ListItem key={order.number}>
                      <h1 style={{ color: 'white' }}>{order.number}</h1>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item md={6}>
              <Paper style={{ margin: '20px', backgroundColor: '#000000' }}>
                <h1 className={styles.ready} style={{ textAlign: 'center' }}>
                  Now Serving
                </h1>
                <List>
                  {queue.servingOrders.map((order) => (
                    <ListItem key={order.number}>
                      <h1 style={{ color: 'white' }}>{order.number}</h1>
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Box>
    </Box>
  );
}
