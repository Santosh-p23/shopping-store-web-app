let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');

let Product = require('./model/products');
let WishList = require('./model/wishlist');

let app = express();
let db = mongoose.connect('mongodb://localhost/myShop');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/product', (req, res) => {
    let product = new Product();
    product.title = req.body.title;
    product.price = req.body.price;
    product.save((err, savedProduct) => {
        if (err) {
            res.status(500).send({ error: 'Could not save the product.' })
        }
        else {
            res.status(200).send(savedProduct);
        }
    })

});

app.get('/product', (req, res) => {
    Product.find({}, (err, products) => {
        if (err) {
            res.status(500).send({ error: "Could not load the products" })
        }
        else {
            res.send(products);
        }
    })
});

app.get('/wishlist', (req, res) => {
    WishList.find({}).populate({ path: 'products', model: 'Product' }).exec((err, wishLists) => {
        if (err) {
            res.status(500).send({ error: "Could not fetch the list" });
        }
        else {
            res.send(wishLists);

        }
    })
});

app.post('/wishlist', (req, res) => {
    var wishList = new WishList();
    wishList.title = req.body.title;

    wishList.save((err, newWishList) => {
        if (err) {
            res.status(500).send({ error: "Could not create the wishlist." });

        }

        else {
            res.send(newWishList);

        }
    });
});

app.put('/wishlist/product/add', (req, res) => {
    Product.findOne({ _id: req.body.productId }, (err, product) => {
        if (err) {
            res.status(500).send({ error: "Could not add items to the wishlist" });
        }
        else {
            WishList.update({ _id: req.body.wishListId }, { $addToSet: { products: product.id } }, (err, wishList) => {
                if (err) {
                    res.status(500).send({ error: "Could not add items to the wishlist" });
                }
                else {
                    res.send('Successfully added to wishlist');
                }
            });
        }
    })
});



PORT = process.env.PORT || 5000
app.listen(PORT, () => { console.log("Goods are at shipping PORT " + PORT) });

