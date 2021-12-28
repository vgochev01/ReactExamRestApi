const { Schema, model } = require('mongoose');
const categories = require('../config/categories');

const schema = new Schema({
    positionName: {
        type: String,
        required: [true, 'Position is a required field!']
    },
    company: {
        type: String,
        required: [true, 'Company name is required!']
    },
    category: {
        type: String,
        enum: {
            values: categories.map(category => category[0].value),
            message: '{VALUE} is not a valid category.'
        },
        required: [true, 'Job Category is required!']
    },
    jobDescription: {
        type: String,
        required: [true, 'Job Description is required!']
    },
    location: {
        type: String,
        required: [true, 'Job Location is required!']
    },
    companyLogo: {
        type: String,
        required: [true, 'Company Logo is required!'],
        match: [/^http[s]?:\/\//, 'Please enter a valid Image URL!']
    },
    salary: {
        type: Number,
        required: [true, 'Please enter a salary'],
        min: [1, 'Salary must be a positive number!']
    },
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = model('JobOffer', schema);