import './App.css';
import {
  Container,
  createTheme,
  CssBaseline,
  Paper,
  ThemeProvider,
} from '@material-ui/core';
import React, { useContext, useEffect } from 'react';
import { Store } from './Store';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomeScreen from './Screens/HomeScreen';
import ChooseScreen from './Screens/ChooseScreen';
import OrderScreen from './Screens/OrderScreen';
import ReviewScreen from './Screens/ReviewScreen';
import SelectPaymentScreen from './Screens/SelectPaymentScreen';
import PaymentScreen from './Screens/PaymentScreen';
import CompleteOrderScreen from './Screens/CompleteOrderScreen';
import AdminScreen from './Screens/AdminScreen';
import QueueScreen from './Screens/QueueScreen';
import OrderScreenPhone from './Screens/OrderScreenPhone';
import LoginScreen from './Screens/LoginScreen';

const theme = createTheme({
  typography: {
    h1: { fontWeight: 'bold' },
    h2: {
      fontSize: '2rem',
      color: 'black',
    },
    h3: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
    },
  },
  palette: {
    primary: { main: '#ff1744' },
    secondary: {
      main: '#118e16',
      contrastText: '#ffffff',
    },
  },
});

function App() {
  const { state, dispatch } = useContext(Store);
  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      dispatch({ type: 'LOGIN_USER', payload: JSON.parse(storedUserInfo) });
    }
  }, [dispatch]);
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth={state.widthScreen ? 'lg' : 'sm'}>
          <Paper>
            <Routes>
              <Route path="/" element={<HomeScreen />} exact />
              <Route path="/choose" element={<ChooseScreen />} exact />
              <Route path="/order" element={<OrderScreenPhone />} exact />
              <Route path="/order-kiosk" element={<OrderScreen />} exact />
              <Route path="/review" element={<ReviewScreen />} exact />
              <Route path="/payment" element={<PaymentScreen />} exact />
              <Route path="/complete" element={<CompleteOrderScreen />} exact />
              <Route path="/admin" element={<AdminScreen />} exact />
              <Route path="/queue" element={<QueueScreen />} exact />
              <Route path="/login" element={<LoginScreen />} exact />
              <Route
                path="/select-payment"
                element={<SelectPaymentScreen />}
                exact
              />
            </Routes>
          </Paper>
        </Container>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
