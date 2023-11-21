import { Typography, Fade, Box, CardActionArea } from '@material-ui/core';
import React, { useContext } from 'react';
import Logo from '../Components/Logo';
import { useStyles } from '../styles';
import { Card, CardMedia, CardContent } from '@material-ui/core';
import { Store } from '../Store';
import { setOrderType } from '../actions';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

export default function HomeScreen() {
  const styles = useStyles();
  const { dispatch } = useContext(Store);
  const navigate = useNavigate(); // 2. Use the hook

  const chooseHandler = (orderType) => {
    setOrderType(dispatch, orderType);
    navigate('/order'); // 3. Replace props.history.push with navigate
  };

  return (
    <Fade in={true}>
      <Box className={[styles.root, styles.navy]}>
        <Box className={[styles.main, styles.center]}>
          <Logo large></Logo>
          <Typography
            className={styles.center}
            gutterBottom
            variant="h3"
            component="h3"
          >
            Where will you be eating today?
          </Typography>
          <Box className={styles.cards}>
            <Card className={[styles.card, styles.space]}>
              <CardActionArea onClick={() => navigate('/order')}>
                {' '}
                {/* Updated here */}
                <CardMedia
                  component="img"
                  alt="Eat in"
                  image="/images/eatin.png"
                  className={styles.media}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h4"
                    color="textPrimary"
                    component="p"
                  >
                    Eat In
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            <Card className={[styles.card, styles.space]}>
              <CardActionArea onClick={() => navigate('/order')}>
                {' '}
                {/* And here */}
                <CardMedia
                  component="img"
                  alt="Take Out"
                  image="/images/takeout.png"
                  className={styles.media}
                />
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h4"
                    color="textPrimary"
                    component="p"
                  >
                    Take Out
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
