import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useStyles } from '../styles';
import Logo from '../Components/Logo';
import { Store } from '../Store';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../actions';

export default function LoginScreen() {
  const styles = useStyles();
  const { state, dispatch } = useContext(Store);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const success = await loginUser(dispatch, username, password);
      console.log('Login success:', success);
      setLoading(false);
      if (success) {
        navigate('/admin');
      }
    } catch (err) {
      setError('Incorrect username or password');
      setLoading(false);
    }
  };

  return (
    <Box className={[styles.root]}>
      <Box className={[styles.main, styles.center]}>
        <Box>
          <Logo large></Logo>
          <Typography
            gutterBottom
            className={styles.title}
            variant="h3"
            component="h3"
          >
            Login
          </Typography>
          <Box className={styles.form}>
            <TextField
              variant="outlined"
              color="primary"
              fullWidth
              id="username"
              type="text"
              label="Username"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></TextField>
            <TextField
              variant="outlined"
              color="primary"
              fullWidth
              id="password"
              type="password"
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ marginTop: '1rem' }}
            ></TextField>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleLogin}
              className={styles.largeButton}
              style={{ marginTop: '1rem' }}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            {error && (
              <Alert severity="error" style={{ marginTop: '1rem' }}>
                {error}
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
