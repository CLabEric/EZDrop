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
    isLive: Boolean,
    published: Boolean,

    abi: Object,
    address: String,
    testAbi: Object,
    testAddress: String,

    polygonAbi: Object,
    polygonAddress: String,
    polygonTestAbi: Object,
    polygonTestAddress: String,

    optimismAbi: Object,
    optimismAddress: String,
    optimismTestAbi: Object,
    optimismTestAddress: String,

    arbitrumAbi: Object,
    arbitrumAddress: String,
    arbitrumTestAbi: Object,
    arbitrumTestAddress: String,

    binanceSCAbi: Object,
    binanceSCAddress: String,
    binanceSCTestAbi: Object,
    binanceSCTestAddress: String,

    avalancheAbi: Object,
    avalancheAddress: String,
    avalancheTestAbi: Object,
    avalancheTestAddress: String,

    fantomAbi: Object,
    fantomAddress: String,
    fantomTestAbi: Object,
    fantomTestAddress: String,

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
