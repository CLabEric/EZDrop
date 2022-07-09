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
    openSeaLink: String,
    testAbi: Object,
    testAddress: String,
    testOpenSeaLink: String,

    polygonAbi: Object,
    polygonAddress: String,
    polygonOpenSeaLink: String,
    polygonTestAbi: Object,
    polygonTestAddress: String,
    polygonTestOpenSeaLink: String,

    optimismAbi: Object,
    optimismAddress: String,
    optimismOpenSeaLink: String,
    optimismTestAbi: Object,
    optimismTestAddress: String,
    optimismTestOpenSeaLink: String,

    arbitrumAbi: Object,
    arbitrumAddress: String,
    arbitrumOpenSeaLink: String,
    arbitrumTestAbi: Object,
    arbitrumTestAddress: String,
    arbitrumTestOpenSeaLink: String,

    binanceSCAbi: Object,
    binanceSCAddress: String,
    binanceSCOpenSeaLink: String,
    binanceSCTestAbi: Object,
    binanceSCTestAddress: String,
    binanceSCTestOpenSeaLink: String,

    avalancheAbi: Object,
    avalancheAddress: String,
    avalancheOpenSeaLink: String,
    avalancheTestAbi: Object,
    avalancheTestAddress: String,
    avalancheTestOpenSeaLink: String,

    fantomAbi: Object,
    fantomAddress: String,
    fantomOpenSeaLink: String,
    fantomTestAbi: Object,
    fantomTestAddress: String,
    fantomTestOpenSeaLink: String,

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
