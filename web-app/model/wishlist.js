let mongoose = require('mongoose');
let Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var wishList = new Schema({
    title: { type: String, default: "My shopping bucket" },
    products: [{ type: ObjectId, ref: 'Product' }]
});

module.exports = mongoose.model('WishList', wishList);