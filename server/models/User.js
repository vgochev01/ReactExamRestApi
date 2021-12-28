const { Schema, model } = require('mongoose');

const schema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    offersCreated: [{ type: Schema.Types.ObjectId, ref: 'JobOffer' }],
    offersApplied: [{ type: Schema.Types.ObjectId, ref: 'JobOffer'}]
});

module.exports = model('User', schema);