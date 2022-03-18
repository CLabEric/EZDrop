const mongoose = require('mongoose');

require('dotenv').config();

/**
 * -------------- DATABASE ----------------
 */

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const ObjectId = mongoose.Schema.ObjectId;

mongoose.set('useFindAndModify', false);

const NFTDropSchema = new mongoose.Schema({
    userId: Number,
    title: String,
    urlParam: String,
    type: String,
    price: Number,
    blurb: String,
    thumbnail: Object,
    description: String,
    descriptionArray: Array,
    traits: Array,
    published: Boolean,
    abi: Object,
    address: String,
    layers: Object
});

const NFTMetaSchema = new mongoose.Schema({
    itemData: Object,
    nftDrop: ObjectId
});

const NFTDrop = connection.model('NFTDrop', NFTDropSchema);

const NFTMeta = connection.model('NFTMeta', NFTMetaSchema);

// Expose the connection
module.exports = connection;
