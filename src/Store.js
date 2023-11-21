import React, { createContext, useReducer } from 'react';
import {
  ORDER_ADD_ITEM,
  ORDER_REMOVE_ITEM,
  ORDER_CLEAR,
  CATEGORY_LIST_FAIL,
  CATEGORY_LIST_REQUEST,
  CATEGORY_LIST_SUCCESS,
  PRODUCT_LIST_FAIL,
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  ORDER_SET_TYPE,
  ORDER_SET_PAYMENT_TYPE,
  ORDER_CREATE_FAIL,
  ORDER_CREATE_SUCCESS,
  ORDER_CREATE_REQUEST,
  SCREEN_SET_WIDTH,
  ORDER_QUEUE_LIST_REQUEST,
  ORDER_QUEUE_LIST_SUCCESS,
  ORDER_QUEUE_LIST_FAIL,
  ORDER_LIST_REQUEST,
  ORDER_LIST_SUCCESS,
  ORDER_LIST_FAIL,
  ORDER_REMOVE_ALL_ITEMS,
  LOAD_SAVED_ORDER_ITEMS,
  LOGIN_USER,
  LOGOUT_USER,
} from './constants';

export const Store = createContext();

const storedUserInfo = localStorage.getItem('userInfo');
const initialUserInfo = storedUserInfo ? JSON.parse(storedUserInfo) : null;

const initialState = {
  widthScreen: false,
  orderList: { loading: true },
  queueList: { loading: true },
  categoryList: { loading: true },
  productList: { loading: true },
  order: {
    orderItems: [],
    orderType: 'Eat in',
    paymentType: 'Pay here',
    taxPrice: 0,
    totalPrice: 0,
    itemsCount: 0,
  },
  orderCreate: { loading: true },
  userInfo: initialUserInfo,
};

function reducer(state, action) {
  switch (action.type) {
    case SCREEN_SET_WIDTH:
      return {
        ...state,
        widthScreen: true,
      };
    case ORDER_SET_TYPE:
      return {
        ...state,
        order: { ...state.order, orderType: action.payload },
      };
    case ORDER_SET_PAYMENT_TYPE:
      return {
        ...state,
        order: { ...state.order, paymentType: action.payload },
      };
    case CATEGORY_LIST_REQUEST:
      return { ...state, categoryList: { loading: true } };
    case CATEGORY_LIST_SUCCESS:
      return {
        ...state,
        categoryList: { loading: false, categories: action.payload },
      };
    case CATEGORY_LIST_FAIL:
      return {
        ...state,
        categoryList: { loading: false, error: action.payload },
      };
    case PRODUCT_LIST_REQUEST:
      return { ...state, productList: { loading: true } };
    case PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        productList: { loading: false, products: action.payload },
      };
    case PRODUCT_LIST_FAIL:
      return {
        ...state,
        productList: { loading: false, error: action.payload },
      };
    case ORDER_QUEUE_LIST_REQUEST:
      return { ...state, queueList: { loading: true } };
    case ORDER_QUEUE_LIST_SUCCESS:
      return {
        ...state,
        queueList: { loading: false, queue: action.payload },
      };
    case ORDER_QUEUE_LIST_FAIL:
      return {
        ...state,
        queueList: { loading: false, error: action.payload },
      };
    case ORDER_LIST_REQUEST:
      return { ...state, orderList: { loading: true } };
    case ORDER_LIST_SUCCESS:
      return {
        ...state,
        orderList: { loading: false, orders: action.payload },
      };
    case ORDER_LIST_FAIL:
      return {
        ...state,
        orderList: { loading: false, error: action.payload },
      };
    case ORDER_CREATE_REQUEST:
      return { ...state, orderCreate: { loading: true } };
    case ORDER_CREATE_SUCCESS:
      return {
        ...state,
        orderCreate: { loading: false, newOrder: action.payload },
      };
    case ORDER_CREATE_FAIL:
      return {
        ...state,
        orderCreate: { loading: false, error: action.payload },
      };
    case ORDER_ADD_ITEM: {
      console.log('HERE');
      const item = action.payload;
      console.log(item);
      const existItem = state.order.orderItems.find(
        (x) => x.name === item.name
      );
      const orderItems = existItem
        ? state.order.orderItems.map((x) =>
            x.name === existItem.name ? item : x
          )
        : [...state.order.orderItems, item];

      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );

      //ONTARIO Tax price should be 13% (TODO Make dynamic)
      const taxPrice = Math.round(0.13 * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;
      return {
        ...state,
        order: {
          ...state.order,
          orderType: 'Eat in',
          paymentType: 'Pay here',
          orderItems,
          taxPrice,
          totalPrice,
          itemsCount,
        },
      };
    }

    case ORDER_REMOVE_ITEM:
      const orderItemIndex = state.order.orderItems.findIndex(
        (x) => x.name === action.payload.name
      );

      if (
        orderItemIndex !== -1 &&
        state.order.orderItems[orderItemIndex].quantity > 1
      ) {
        state.order.orderItems[orderItemIndex].quantity -= 1;
      } else {
        state.order.orderItems.splice(orderItemIndex, 1);
      }

      const orderItems = [...state.order.orderItems]; // after updating quantity or removing item
      const itemsCount = orderItems.reduce((a, c) => a + c.quantity, 0);
      const itemsPrice = orderItems.reduce(
        (a, c) => a + c.quantity * c.price,
        0
      );
      const taxPrice = Math.round(0.15 * itemsPrice * 100) / 100;
      const totalPrice = Math.round((itemsPrice + taxPrice) * 100) / 100;

      return {
        ...state,
        order: {
          ...state.order,
          orderItems,
          taxPrice,
          totalPrice,
          itemsCount,
        },
      };

    case ORDER_CLEAR:
      return {
        ...state,
        order: {
          orderItems: [],
          taxPrice: 0,
          totalPrice: 0,
          itemsCount: 0,
        },
      };
    case LOAD_SAVED_ORDER_ITEMS:
      return { ...state, orderItems: action.payload };

    case LOGIN_USER:
      return {
        ...state,
        user: action.payload, // Set the user data in your state
      };

    case 'USER_LOGOUT':
      return { ...state, userInfo: null };

    default:
      return state;
  }
}

export function StoreProvider(props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  //const [state, dispatch] = useReducerWithThunk(reducer, initialState, 'example');

  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
