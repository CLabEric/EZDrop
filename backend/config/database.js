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
// const Integer = mongoose.Schema.Integer;
mongoose.set('useFindAndModify', false);
// Creates simple schema for a User.  The hash and salt are derived from the user's given password when they register
const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    hash: String,
    salt: String
});

const NFTDropSchema = new mongoose.Schema({
    userId: Number,
    title: String,
    urlParam: String,
    type: String,
    price: Number,
    description: String,
    traits: Array
});

const NFTMetaSchema = new mongoose.Schema({
    itemData: Object,
    nftDrop: ObjectId
});


const User = connection.model('User', UserSchema);

const NFTDrop = connection.model('NFTDrop', NFTDropSchema);

const NFTMeta = connection.model('NFTMeta', NFTMetaSchema);

// Expose the connection
module.exports = connection;
