import { makeStyles } from '@material-ui/core';
import { ImportantDevices } from '@material-ui/icons';

const websiteColor = '#003080';
export const useStyles = makeStyles((theme) => ({
  root: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden',
  },
  black: {
    backgroundColor: '#000000',
    color: '#000000',
  },
  main: {
    flex: 1,
    overflowY: 'hidden',
    flexDirection: 'column',
    display: 'flex',
    color: '#ffffff',
  },
  mainblack: {
    flex: 1,
    overflowY: 'hidden',
    flexDirection: 'column',
    display: 'flex',
    color: '#000000',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  customBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    margin: '20px',
    marginBottom: '20px',
  },
  largeLogo: {
    height: 80,
    width: 200,
  },
  logo: {
    height: 50,
    width: '100px',
    padding: '10px',
    marginRight: '10px',
  },
  navy: {
    backgroundColor: websiteColor,
  },
  cards: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    margin: 10,
    width: 200,
    height: 225,
  },
  cardrect: {
    margin: 10,
    height: 100,
  },
  avatar: {
    width: 50,
    height: 50,
    '& > img': {
      // This ensures that the img tag inside the Avatar component will take these styles
      objectFit: 'contain',
    },
  },
  media: {
    height: 140,
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    margin: 'auto',
  },
  largeButton: {
    width: 250,
    backgroundColor: websiteColor + '!important', //CHANGE COLOUR HERE TO DESIRED COLOUR
    color: 'white !important',
    '&:disabled': {
      backgroundColor: '#94b9c5 !important',
      color: '#gray !important',
    },
    '&:hover': {
      backgroundColor: '#5889b8 !important',
    },
  },
  largeInput: {
    width: '60px!important',
    padding: '0!important',
    fontSize: '30px!important',
    textAlign: 'center!important',
  },
  bordered: {
    borderWidth: 2,
    borderRadius: 5,
    margin: 5,
    borderStyle: 'solid',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    display: 'flex !important',
    flexDirection: 'column !important',
  },
  leftSpace: {
    marginLeft: '1rem', // adjust this as needed
  },
  space: {
    padding: 10,
  },
  smallSpace: {
    padding: 5,
  },
  around: {
    justifyContent: 'space-around',
    padding: 10,
  },
  between: {
    justifyContent: 'space-between',
  },
  mediasmall: {
    height: 60,
    width: 'auto', // Width automatically adjusts based on the height and image's aspect ratio
    objectFit: 'contain',
    margin: 0,
    padding: 0,
    flexShrink: 0,
    flexGrow: 0,
  },

  flexContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  smallbutton: {
    width: 50,
    height: 20,
    color: websiteColor + '!important', //CHANGE COLOUR HERE TO DESIRED COLOUR
  },
  ready: {
    backgroundColor: websiteColor,
    color: '#ffffff',
    marginTop: 0,
  },
  processing: {
    backgroundColor: websiteColor,
    color: '#ffffff',
    marginTop: 0,
  },
  cardvertical: {
    margin: '10',
    border: 'none',
    height: '100%',
    width: '100%',
    boxShadow: 'none', // remove shadow
  },
  smallbuttonsquared: {
    width: '20px!important',
    height: '20px!important',
    minWidth: '20px!important',
    padding: '0',
    minHeight: '0',
    backgroundColor: 'transparent !important',
    color: 'black !important',
    boxShadow: 'none !important',
    '&:disabled': {
      backgroundColor: 'transparent !important',
      color: 'gray !important',
    },
    '&:hover': {
      backgroundColor: 'transparent !important',
    },
  },

  rightAlignedContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    flexGrow: 1,
    width: '100%',
  },

  centerTextInput: {
    '& input': {
      textAlign: 'center',
      fontSize: '12px',
      width: '20px',
    },
    '& .MuiFilledInput-root': {
      backgroundColor: 'transparent',
    },
    '& .MuiFilledInput-underline:before': {
      display: 'none',
    },
    '& .MuiFilledInput-underline:after': {
      display: 'none',
    },
  },

  tab: {
    color: '#000',
    backgroundColor: '#fff',
    whiteSpace: 'nowrap',
    padding: theme.spacing(1, 3), // Adding horizontal padding
  },
  customTabRoot: {
    minWidth: 'auto !important',
    padding: theme.spacing(1, 2), // Adjust as per your requirements
  },
  selectedTab: {
    '& span': {
      color: 'black',
    },
  },
  tabIndicator: {
    backgroundColor: websiteColor + '!important', // Change 'blue' to your desired color
  },

  unselectedTab: {
    color: 'gray !important', // This sets the text color for the inactive tabs. Adjust as per your preference.
  },
  navyButton: {
    backgroundColor: 'navy',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkblue',
    },
  },
  ovalControl: {
    backgroundColor: 'navy',
    borderRadius: '20px',
    display: 'flex',
    alignItems: 'center',
    padding: '5px 15px',
  },
  controlButton: {
    color: 'white',
    minWidth: 'auto',
    padding: '0 5px',
  },
  controlInput: {
    color: 'white',
    width: '40px',
    textAlign: 'center',
  },
  searchBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end !important',
    margin: '10px',
  },
  productsContainer: {
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 210px)',
    width: '100%',
  },
  subtitle: {
    fontSize: '1.5rem',
    margin: '0.5rem 0',
    color: 'black',
  },
  passwordText: {
    color: websiteColor,
  },
  logoTop: {
    marginTop: '4rem',
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  touchIconAnimation: {
    animation: '$pulse 0.5s infinite alternate',
  },

  '@keyframes pulse': {
    '0%': {
      transform: 'scale(1)',
    },
    '100%': {
      transform: 'scale(1.7)', // adjust scale value to your preference
    },
  },
  customDrawer: {
    width: '10%',
    transform: 'translateX(308.5%) !important',
  },
}));
