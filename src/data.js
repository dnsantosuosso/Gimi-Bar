const { MicOutlined } = require('@material-ui/icons');

//TODO: Add categories to Database? Don't hardcode
const data = {
  categories: [
    {
      name: 'Beers',
      image: '/images/beers.jpg',
    },
    {
      name: 'Cocktails',
      image: '/images/cocktails.jpg',
    },
    {
      name: 'Wines',
      image: '/images/wines.jpg',
    },
    {
      name: 'Spirits and Liquors',
      image: '/images/spirits-liquors.jpg',
    },
    {
      name: 'Shots',
      image: '/images/shots.jpg',
    },
    {
      name: 'Soft Drinks',
      image: '/images/softdrinks.jpg',
    },
  ],
};

module.exports = data;
