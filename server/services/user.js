const User = require('../models/User');

async function createUser(username, email, hashedPassword){
    const existing = await User.findOne({ email });

    if(existing){
        throw new Error('There is already an user with that email!');
    }

    const user = new User({ username, email, hashedPassword, hotelsCreated: [], hotelsBooked: [] });
    await user.save();
    return user;
}

async function getUserByEmail(email){
    return User.findOne({ email });
}

async function addOfferToList(userId, offerId){
    try {
        const user = await User.findById(userId);
        user.offersCreated.push(offerId);
        return user.save();
    } catch (err) {
        throw new Error('Database Error');
    }
}

async function addAppliedOffers(userId, offerId){
    try {
        const user = await User.findById(userId);
        user.offersApplied.push(offerId);
        return user.save();
    } catch (err) {
        throw new Error('Database Error');
    }
}

async function getProfile(userId) {
    try {
        const user = await User.findById(userId).populate('offersApplied').populate('offersCreated');
        return user;
    } catch (err) {
        throw new Error('Database Error');
    }
}

async function editProfile(userId, data) {
    try {
        const user = await User.findById(userId);
        Object.assign(user, data);
        await user.save();
        return user;
    } catch (err) {
        throw new Error('Database Error');
    }
}

module.exports = {
    createUser,
    getUserByEmail,
    addOfferToList,
    addAppliedOffers,
    getProfile,
    editProfile
};