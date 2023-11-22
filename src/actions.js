import Axios from 'axios';
import {
  ORDER_SET_TYPE,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  ORDER_ADD_ITEM,
  ORDER_CLEAR,
  ORDER_REMOVE_ITEM,
  ORDER_SET_PAYMENT_TYPE,
  ORDER_CREATE_REQUEST,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_LIST_REQUEST,
  ORDER_LIST_FAIL,
  ORDER_LIST_SUCCESS,
  SCREEN_SET_WIDTH,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
  ORDER_REMOVE_ALL_ITEMS,
  LOGIN_USER,
} from './constants';

export const setOrderType = (dispatch, orderType) => {
  return dispatch({
    type: ORDER_SET_TYPE,
    payload: orderType,
  });
};

export const setPaymentType = async (dispatch, paymentType) => {
  return dispatch({
    type: ORDER_SET_PAYMENT_TYPE,
    payload: paymentType,
  });
};
export const listCategories = async (dispatch) => {
  dispatch({ type: CATEGORY_LIST_REQUEST });
  try {
    //send AJAX Request to backend to get list of categories
    const { data } = await Axios.get('/api/products/categories');
    return dispatch({
      type: CATEGORY_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: CATEGORY_LIST_FAIL,
      payload: error.message,
    });
  }
};

//TODO: Should be get request. Easy fix converted it to post so static files dont serve first
export const listProducts = async (dispatch, categoryName = '') => {
  dispatch({ type: PRODUCT_LIST_REQUEST });
  try {
    const { data } = await Axios.post(
      `/api/products/?category=${categoryName}`
    );
    console.log('We are here, we made the call successfully ', { data });
    return dispatch({
      type: PRODUCT_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.log('We hit an error');
    return dispatch({
      type: PRODUCT_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const clearOrder = async (dispatch) => {
  return dispatch({
    type: ORDER_CLEAR,
  });
};

export const addToOrder = async (dispatch, item) => {
  return dispatch({
    type: ORDER_ADD_ITEM,
    payload: item,
  });
};
export const removeFromOrder = async (dispatch, item) => {
  return dispatch({
    type: ORDER_REMOVE_ITEM,
    payload: item,
  });
};

export const removeAllItemsFromOrder = async (dispatch, item) => {
  return dispatch({
    type: 'ORDER_REMOVE_ALL_ITEMS',
    payload: item,
  });
};

export const createOrder = async (dispatch, order) => {
  dispatch({ type: ORDER_CREATE_REQUEST });
  try {
    const { data } = await Axios.post('/api/orders', order);
    dispatch({
      type: ORDER_CREATE_SUCCESS,
      payload: data,
    });
    dispatch({
      type: ORDER_CLEAR,
    });
  } catch (error) {
    dispatch({
      type: ORDER_CREATE_FAIL,
      payload: error.message,
    });
  }
};

export const listOrders = async (dispatch) => {
  dispatch({ type: ORDER_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`/api/orders`);
    dispatch({ type: SCREEN_SET_WIDTH });
    return dispatch({
      type: ORDER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: ORDER_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const listQueue = async (dispatch) => {
  dispatch({ type: ORDER_QUEUE_LIST_REQUEST });
  try {
    const { data } = await Axios.get(`/api/orders/placed-orders/queue`);
    dispatch({ type: SCREEN_SET_WIDTH });
    return dispatch({
      type: ORDER_QUEUE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    return dispatch({
      type: ORDER_QUEUE_LIST_FAIL,
      payload: error.message,
    });
  }
};

export const loginUser = async (dispatch, username, password) => {
  try {
    const response = await Axios.post('/api/users/login', {
      username,
      password,
    });

    if (response.data && response.data._id) {
      dispatch({ type: LOGIN_USER, payload: response.data });

      // Persist user data for session persistence
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      return true; // login success
    } else {
      throw new Error(response.data.message || 'Failed to login');
    }
  } catch (err) {
    console.error('Failed to login', err);
    throw err; // let the LoginScreen handle the error
  }
};

export const logoutUser = async (dispatch) => {
  try {
    // Make an API call to logout
    await Axios.post('/api/users/logout');

    // Clear user data from local storage and state
    localStorage.removeItem('userInfo');
    console.log('Logged out?');

    dispatch({ type: 'LOGOUT_USER' });
  } catch (error) {
    console.error('Error logging out:', error);
  }
};
