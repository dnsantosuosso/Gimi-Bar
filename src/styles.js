import { makeStyles } from '@material-ui/core';
import { ImportantDevices } from '@material-ui/icons';

const websiteColor = '#003080';
export const useStyles = makeStyles((theme) => ({
  black: {
    backgroundColor: '#000000',
    color: '#000000',
  },
  // Define other styles here
  customDrawer: {
    // Adjust drawer styles for mobile
  },
  // Responsive styles for Grid items
  responsiveGridItem: {
    // Regular styles for larger screens can go here
    padding: theme.spacing(2),
    margin: theme.spacing(1),

    [theme.breakpoints.down('sm')]: {
      // Reduced padding and margin on small screens
      padding: theme.spacing(1),
      margin: theme.spacing(0.5),
    },
  },
  // Add other responsive styles as needed
  root: {
    maxWidth: '100%', // Ensures the container doesn't exceed the screen width
    maxHeight: '90vh',
    margin: '0 auto', // Centers the container
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'hidden', // changed from 'hidden' to 'auto'
    position: 'relative',
    minHeight: '90vh',
  },

  main: {
    maxWidth: '100%',
    flex: 1,
    overflowY: 'hidden', // Allow scrolling if content overflows
    overflowX: 'hidden', // Prevent horizontal scrolling
    flexDirection: 'column',
    display: 'flex',
    color: '#ffffff',
    padding: '10px', // Add some padding
    [theme.breakpoints.down('sm')]: {
      // Adjust styles for small screens
      padding: '5px',
    },
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
    padding: '5px',
    marginRight: '10px',
    marginTop: '10px',
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
    margin: theme.spacing(0.3), // Add some margin
    flex: 1, // Makes the buttons flexibly fill the space
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

  bordered: {
    borderWidth: 2,
    borderRadius: 5,
    margin: 5,
    borderStyle: 'solid',
    height: '35px',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    display: 'flex !important',
    flexDirection: 'column !important',
    marginTop: '40px',
  },
  leftSpace: {
    marginLeft: '1rem', // adjust this as needed
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
  smallButton: {
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
    // Add the following to target the TextField focus style
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: websiteColor,
      },
    },
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
  container: {
    transform: 'scale(1)', // Default scale
    transformOrigin: 'top center', // Ensure scaling happens from the top
    [theme.breakpoints.down('sm')]: {
      //transform: 'scale(0.2) !important !important', // Scale down for small screens
    },
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0, // This ensures it extends to the full width
    padding: theme.spacing(2),
    backgroundColor: '#fff',
    width: '100%', // Make sure this is set to 100%
    boxSizing: 'border-box', // Ensures padding doesn't affect the overall width
  },

  borderlessCard: {
    border: 'none',
    boxShadow: 'none', // Removes the default shadow as well
  },
  quantityLabel: {
    minWidth: '50px',
    textAlign: 'center',
    fontSize: '1.4rem',
  },
  form: {
    // Add the following to target the TextField focus style
    '& .MuiOutlinedInput-root': {
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: websiteColor,
      },
    },
    '& .MuiInputLabel-outlined.Mui-focused': {
      color: websiteColor, // This will change the label color to black when focused
    },
  },
  barcodeBox: {
    marginTop: '40px',
  },
  uniformButton: {
    minWidth: '100px', // adjust this value as needed
  },
  uniformButtonMobile: {
    minWidth: '90px !important',
  },
  // Style for AppBar color on mobile devices
  appBarMobile: {
    backgroundColor: '#003080 !important',
  },
  mobileTableCell: {
    [theme.breakpoints.down('sm')]: {
      padding: '8px 2px', // Adjust these values as needed
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
    },
  },
  regularTableCell: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  primary: {
    backgroundColor: websiteColor + '!important',
    color: 'white !important',
  },
  secondary: {
    backgroundColor: '#5889b8 !important',
    color: 'white !important',
  },
  tertiary: {
    backgroundColor: '#02151c !important',
    color: 'white !important',
  },
  expandButton: {
    // Your custom styles for the expand button
    minWidth: 'auto',
    padding: '0',
    marginLeft: theme.spacing(1),
  },
}));
