const router = require('express').Router();
const categories = require('../config/categories');
const { isAuth, isOwner, notOwner } = require('../middlewares/guards');
const preload = require('../middlewares/preload');
const { addOfferToList, addAppliedOffers } = require('../services/user');
const { parseMongooseError } = require('../util/parse');

router.post('/', isAuth(), async(req, res) => {
    const data = {
        positionName: req.body.positionName,
        company: req.body.company,
        category: req.body.category,
        jobDescription: req.body.jobDescription,
        location: req.body.location,
        companyLogo: req.body.companyLogo,
        salary: Number(req.body.salary),
        applicants: [],
        owner: req.user._id
    }
    try {
        const offer = await req.storage.create(data);
        await addOfferToList(req.user._id, offer._id);
        res.json(offer);
    } catch (err) {
        let message = err.message;
        if(err.name == 'ValidationError'){
            message = parseMongooseError(err)[0];
        }
        res.status(err.status || 400).json({ message });
    }
});

router.get('/', async(req, res) => {
    let { category: searchedCategory, position: searchedPosition, owner: ownerId } = req.query;
    let data = await req.storage.getAll({ searchedCategory, searchedPosition, ownerId });
    data = data.map(job => {
        job.category = categories.find(cat => cat[0].value == job.category)[1];
        return job;
    });
    res.json(data);
});

router.get('/:id', preload, async(req, res) => {
    const data = req.data.toObject();
    delete data.owner.hashedPassword;
    data.applicants = data.applicants.map(user => { 
        delete user.hashedPassword;
        return user;
    });
    data._ownerId = data.owner._id;
    data.category = categories.find(cat => cat[0].value == data.category)[1];
    res.json(data);
});

router.put('/:id', isAuth(), preload, isOwner(), async(req, res) => {
    const data = {
        positionName: req.body.positionName,
        company: req.body.company,
        category: req.body.category,
        jobDescription: req.body.jobDescription,
        location: req.body.location,
        companyLogo: req.body.companyLogo,
        salary: Number(req.body.salary)
    }

    try {
        const result = await req.storage.edit(req.data, data);
        res.json(result);
    } catch (err) {
        let message = err.message;
        if(err.name == 'ValidationError'){
            message = parseMongooseError(err)[0];
        }
        res.status(err.status || 400).json({ message });
    }
});

router.delete('/:id', isAuth(), preload, isOwner(), async(req, res) => {
    try {
        await req.storage.deleteItem(req.params.id);
        res.json({});
    } catch (err) {
        res.status(err.status || 400).json({ message: err.message });
    }
});

router.get('/:id/apply', isAuth(), preload, notOwner(), async(req, res) => {
    try {
        const offer = await req.storage.applyToOffer(req.data, req.user._id);
        await addAppliedOffers(req.user._id, req.data._id);
        res.json(offer);
    } catch(err) {
        res.status(err.status || 400).json({ message: err.message });
    }
});

module.exports = router;