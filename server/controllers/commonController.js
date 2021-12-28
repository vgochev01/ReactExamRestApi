const router = require('express').Router();
const categories = require('../config/categories');

router.get('/categories', (req, res, next) => {
    res.json(categories);
});

module.exports = router;