var express = require('express');
var router = express.Router();
const path = require('path'); // Import path module
const productHelpers = require('../helpers/product-helpers');

/* GET admin products listing. */
router.get('/', function (req, res, next) {
    productHelpers.getAllProducts().then((products) => {
        res.render('admin/view-products', { admin: true, products });
    });
});

router.get('/add-product', function (req, res) {
    res.render('admin/add-product');
});

// Add product route
router.post('/add-product', (req, res) => {
  productHelpers.addProduct(req.body, (id) => {
    if (req.files && req.files.Image) {
      let image = req.files.Image;
      
      // Validate file type
      const validExtensions = ['.jpg', '.jpeg', '.png'];
      const fileExtension = path.extname(image.name).toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        return res.status(400).send('Only JPG and PNG images are allowed.');
      }

      const imagePath = path.join(__dirname, '../public/product-images/', `${id}${fileExtension}`);
      image.mv(imagePath, (err) => {
        if (err) {
          console.error('Image upload error:', err);
          res.status(500).send('Error uploading image');
        } else {
          res.redirect('/admin');
        }
      });
    } else {
      res.status(400).send('No image uploaded');
    }
  });
});

router.get('/delete-product/:id', (req, res) => {
    let proId = req.params.id;
    productHelpers.deleteProduct(proId).then((response) => {
        res.redirect('/admin/');
    });
});

router.get('/edit-product/:id', async (req, res) => {
    let product = await productHelpers.getProductDetails(req.params.id);
    res.render('admin/edit-product', { product });
});

// Edit product route
router.post('/edit-product/:id', (req, res) => {
  let id = req.params.id;

  // Update the product details
  productHelpers.updateProduct(id, req.body).then(() => {
      // Check if an image was uploaded
      if (req.files && req.files.Image) {
          let image = req.files.Image;

          // Validate file type
          const validExtensions = ['.jpg', '.jpeg', '.png'];
          const fileExtension = path.extname(image.name).toLowerCase();

          if (!validExtensions.includes(fileExtension)) {
              return res.status(400).send('Only JPG and PNG images are allowed.');
          }

          image.mv('./public/product-images/' + id + fileExtension, (err) => {
              if (err) {
                  console.error('Image upload error:', err);
                  return res.status(500).send("Error uploading image");
              }
              res.redirect('/admin');
          });
      } else {
          res.redirect('/admin');
      }
  }).catch(err => {
      console.error('Product update error:', err);
      res.status(500).send("Error updating product");
  });
});
module.exports = router;
