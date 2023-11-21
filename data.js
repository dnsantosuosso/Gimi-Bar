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
  products: [
    {
      category: 'Soft Drinks',
      name: 'Sprite',
      calories: 120,
      price: 1,
      image: '/images/softdrinks-sprite',
    },
    {
      category: 'Beers',
      name: 'Corona',
      calories: 120,
      price: 5,
      image: '/images/beers-corona',
    },
    {
      category: 'Wine',
      name: 'Pinot Grigio',
      calories: 120,
      price: 5,
      image: '/images/wines-pinot-grigio',
    },
    {
      category: 'Cocktails',
      name: 'Margarita',
      calories: 120,
      price: 7,
      image: '/images/cocktails-margarita',
    },
    {
      category: 'Spirits and Liquors',
      name: 'Rum and Coke',
      calories: 120,
      price: 6,
      image: '/images/spirits-liquors-rum-coke',
    },
    {
      category: 'Shots',
      name: 'Tequila',
      calories: 120,
      price: 4,
      image: '/images/shots-tequila',
    },
  ],
};

module.exports = data;
