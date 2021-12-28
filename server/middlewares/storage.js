const offersService = require('../services/offers');

module.exports = () => (req, res, next) => {
    req.storage = Object.assign({}, offersService);
    next();
}