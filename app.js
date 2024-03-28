var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database1');
var bodyParser = require('body-parser');
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

mongoose.connect(database.url);

var Product = require('./models/product');

// Show all product-info
app.get('/api/products', async function(req, res) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Show a specific product based on the _id or asin
app.get('/api/products/:productId', async function(req, res) {
    try {
        const product = await Product.findOne({ $or: [{ _id: req.params.productId }, { asin: req.params.productId }] });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Insert a new product
app.post('/api/products', async function(req, res) {
    try {
        const product = await Product.create(req.body);
        res.json(product);
    } catch (err) {
        res.status(400).send(err);
    }
});

// Delete an existing product based on the _id or asin
app.delete('/api/products/:productId', async function(req, res) {
    try {
        const product = await Product.findOneAndDelete({ $or: [{ _id: req.params.productId }, { asin: req.params.productId }] });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.send('Successfully! Product has been deleted.');
    } catch (err) {
        res.status(500).send(err);
    }
});

// Update "title" & "price" of an existing product based on the _id or asin
app.put('/api/products/:productId', async function(req, res) {
    try {
        const product = await Product.findOneAndUpdate({ $or: [{ _id: req.params.productId }, { asin: req.params.productId }] }, {
            title: req.body.title,
            price: req.body.price
        }, { new: true });
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(port);
console.log("App listening on port : " + port);
