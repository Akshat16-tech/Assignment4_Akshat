const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    asin: {type:String , required: true},
    title: String,
    imgUrl: String,
    stars: Number,
    reviews: Number,
    price: Number,
    listPrice: Number,
    categoryName: String,
    isBestSeller: Boolean,
    boughtInLastMonth: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
