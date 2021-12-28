const userController = require('../controllers/userController');
const catalogController = require('../controllers/catalogController');
const commonController = require('../controllers/commonController');

module.exports = (app) => {
    app.use('/users', userController);
    app.use('/jobs', catalogController);
    app.use('/common', commonController);
}