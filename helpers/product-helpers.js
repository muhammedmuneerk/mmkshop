const db = require('../config/connection');
var collection = require('../config/collections');
var objectId = require('mongodb').ObjectId;

module.exports = {
    addProduct: (product, callback) => {
        db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((data) => {
            callback(data.insertedId);
        });
    },

    getAllProducts: () => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray();
            resolve(products);
        });
    },

    deleteProduct: (prodId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: new objectId(prodId) }).then((response) => {
                resolve(response);
            });
        });
    },

    getProductDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: new objectId(proId) }).then((product) => {
                resolve(product);
            });
        });
    },

    updateProduct: (proId, proDetails) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION)
                .updateOne({ _id: new objectId(proId) }, {
                    $set: {
                        Name: proDetails.Name,
                        Description: proDetails.Description,
                        Price: proDetails.Price,
                        Category: proDetails.Category
                    }
                }).then((response) => {
                    resolve();
                }).catch(err => {
                    reject(err);
                });
        });
    }
};
