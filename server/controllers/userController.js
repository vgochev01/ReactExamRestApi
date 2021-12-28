const { isAuth, isGuest } = require('../middlewares/guards');
const { editProfile, getProfile } = require('../services/user');
const { createToken } = require('../middlewares/auth');
const categories = require('../config/categories');

const router = require('express').Router();

router.post('/register', isGuest() , async (req, res) => {
    try {
        const userData = await req.auth.register(req.body.username, req.body.email, req.body.password);
        res.json(userData);
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 400).json({ message: err.message });
    }
});

router.post('/login', isGuest(), async(req, res) => {
    try {
        const userData = await req.auth.login(req.body.email, req.body.password);
        res.json(userData);
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 400).json({ message: err.message });
    }
});

router.get('/logout', (req, res) => {
    res.json({});
});

router.get('/profile', isAuth(), async (req, res) => {
    try {
        const userData = await getProfile(req.user._id);
        userData['hashedPassword'] = null;

        userData.offersCreated = userData.offersCreated.map(job => {
            job.category = categories.find(cat => cat[0].value == job.category)[1];
            return job;
        });

        userData.offersApplied = userData.offersApplied.map(job => {
            job.category = categories.find(cat => cat[0].value == job.category)[1];
            return job;
        });

        res.json(userData);
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 400).json({ message: err.message });
    }
})

router.post('/edit', isAuth(), async (req, res) => {
    try { 
        const newUserData = {
            email: req.body.email,
            username: req.body.username
        }
        const updatedUser = await editProfile(req.user._id, newUserData);

        const userData = {
            _id: updatedUser._id,
            email: updatedUser.email,
            username: updatedUser.username,
            accessToken: createToken(updatedUser)
        };

        res.json(userData);
    } catch (err) {
        console.log(err.message);
        res.status(err.status || 400).json({ message: err.message });
    }
});

module.exports = router;