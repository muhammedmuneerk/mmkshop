var express = require('express');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

// Middleware to check if user is logged in
const verifyLogin = (req, res, next) => {
  if (req.session.userLoggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
};

// GET home page
router.get('/', async function (req, res, next) {
  let user = req.session.user;
  console.log(user);
  let cartCount = null;

  if (user) {
    cartCount = await userHelpers.getCartCount(user._id);
  }

  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user, cartCount }); // Pass user to the view
  });
});

// Login page
router.get('/login', (req, res) => {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('user/login', { "loginErr": req.session.userLoginErr });
    req.session.userLoginErr = false; // Reset login error
  }
});

// Signup page
router.get('/signup', (req, res) => {
  res.render('user/signup');
});

// Handle signup
router.post('/signup', (req, res) => {
  userHelpers.doSignup(req.body).then((response) => {
    console.log(response);
    req.session.user = response;
    req.session.user.loggedIn = true;
    req.session.userLoggedIn = true; // Ensure userLoggedIn is set to true
    res.redirect('/');
  });
});

// Handle login
router.post('/login', (req, res) => {
  userHelpers.doLogin(req.body).then((response) => {
    if (response.status) {
      req.session.user = response.user;
      req.session.user.loggedIn = true;
      req.session.userLoggedIn = true; // Ensure userLoggedIn is set to true
      res.redirect('/');
    } else {
      req.session.userLoginErr = "Invalid username or password";
      res.redirect('/login');
    }
  });
});

// Logout
router.get('/logout', (req, res) => {
  req.session.user = null;
  req.session.userLoggedIn = false; // Set userLoggedIn to false
  res.redirect('/');
});

// Cart page
router.get('/cart', verifyLogin, async (req, res) => {
  try {
    let products = await userHelpers.getCartProducts(req.session.user._id);
    let totalValue = 0;

    if (products.length > 0) {
      totalValue = await userHelpers.getTotalAmount(req.session.user._id);
    }
    res.render('user/cart', { products, user: req.session.user, totalValue }); // Pass user to the view
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.redirect('/'); // Or handle the error appropriately
  }
});

// Add to cart
router.get('/add-to-cart/:id', (req, res) => {
  console.log("api call");
  userHelpers.addToCart(req.params.id, req.session.user._id).then(() => {
    res.json({ status: true });
  });
});

// Change product quantity
router.post('/change-product-quantity', (req, res, next) => {
  console.log(req.body);
  userHelpers.changeProductQuantity(req.body).then(async (response) => {
    response.total = await userHelpers.getTotalAmount(req.body.user);
    res.json(response);
  });
});

// Place order page
router.get('/place-order', verifyLogin, async (req, res) => {
  let total = await userHelpers.getTotalAmount(req.session.user._id);
  res.render('user/place-order', { total, user: req.session.user }); // Pass user to the view
});

// Handle order placement
router.post('/place-order', async (req, res) => {
  let products = await userHelpers.getCartProductList(req.body.userId);
  let totalPrice = await userHelpers.getTotalAmount(req.body.userId);
  userHelpers.placeOrder(req.body, products, totalPrice).then((orderId) => {
    if (req.body['payment-method'] === 'COD') {
      res.json({ codSuccess: true });
    } else {
      userHelpers.generateRazorpay(orderId, totalPrice).then((response) => {
        res.json(response);
      });
    }
  });
  console.log(req.body);
});

// Order success page
router.get('/order-success', (req, res) => {
  res.render('user/order-success', { user: req.session.user }); // Pass user to the view
});

// User orders page
router.get('/orders', verifyLogin, async (req, res) => {
  let orders = await userHelpers.getUserOrders(req.session.user._id);
  res.render('user/orders', { user: req.session.user, orders }); // Pass user to the view
});

// View order products
router.get('/view-order-products/:id', async (req, res) => {
  let products = await userHelpers.getOrderProducts(req.params.id);
  console.log(req.params.id);  // Log the products array
  res.render('user/view-order-products', { user: req.session.user, products }); // Pass user to the view
});

// Verify payment
router.post('/verify-payment', (req, res) => {
  console.log(req.body);
  userHelpers.verifyPayment(req.body).then(() => {
    userHelpers.changePaymentStatus(req.body['order[receipt]']).then(() => {
      console.log("Payment successful");
      res.json({ status: true });
    });
  }).catch((err) => {
    console.log(err);
    res.json({ status: false, errMsg: '' });
  });
});

module.exports = router;
