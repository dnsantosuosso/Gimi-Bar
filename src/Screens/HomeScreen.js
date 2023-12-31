import React, { useState, useEffect } from 'react';
import { Box, Card, CardActionArea, Typography } from '@material-ui/core';
import TouchAppIcon from '@material-ui/icons/TouchApp';
import { useStyles } from '../styles';
import { useNavigate } from 'react-router-dom';

export default function HomeScreen() {
  const styles = useStyles();
  const navigate = useNavigate();

  const [text, setText] = useState('');
  const fullText = 'Gimi Bar';

  // useEffect(() => {
  //   if (text.length < fullText.length) {
  //     setTimeout(() => {
  //       setText(fullText.slice(0, text.length + 1));
  //     }, 160);
  //   }
  // }, [text]);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/order');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <Box className={styles.container}>
      <Card>
        <CardActionArea
          style={{ position: 'relative' }}
          onClick={() => navigate('/order')}
        >
          <Box className={[styles.root]} style={{ backgroundColor: 'black' }}>
            <Box className={[styles.main, styles.center]} style={{ zIndex: 1 }}>
              <Typography
                component="h6"
                variant="h6"
                style={{ textShadow: '2px 2px 4px #000000' }}
              >
                Fast and Easy
              </Typography>
              <Typography
                component="h2"
                variant="h1"
                style={{ textShadow: '2px 2px 4px #000000' }}
              >
                {fullText}
              </Typography>
              <TouchAppIcon
                fontSize="large"
                className={styles.touchIconAnimation}
              />
            </Box>
            <Box
              className={[styles.center]}
              style={{ zIndex: 1, padding: '20px' }}
            >
              <Typography
                component="h2"
                variant="h3"
                style={{ textShadow: '2px 2px 4px #000000' }}
              >
                Touch to start
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </Box>
  );
}
