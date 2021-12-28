const JobOffer = require('../models/JobOffer');

async function create(data){
    const offer = new JobOffer(data);
    await offer.save();
    return offer;
}

async function getAll({ searchedCategory, searchedPosition, ownerId }){
    let query = {};
    if(ownerId){
        Object.assign(query, { owner: ownerId });
    }
    if(searchedCategory){
        Object.assign(query, { category: { $regex: searchedCategory, $options: 'i' } });
    }

    if(searchedPosition){
        Object.assign(query, { jobPosition: { $regex: searchedPosition, $options: 'i' } });
    }
    return JobOffer.find(query).lean();
}

async function getById(id){
    try {
        const data = await JobOffer.findById(id).populate('owner').populate('applicants');
        return data;
    } catch (err) {
        throw new Error('Database Error');
    }
}

async function edit(existing, updated) {
    Object.assign(existing, updated);
    await existing.save();
    return existing;
}

async function deleteItem(id){
    try {
        await JobOffer.findByIdAndDelete(id);
    } catch (err) {
        throw new Error('No such id in database!');
    }
}

async function applyToOffer(offer, userId) {

    if(offer.applicants.includes(userId)){
        throw new Error('You have already applied to this job offer!')
    }

    try {
        offer.applicants.push(userId);
        await offer.save();
        return await getById(offer._id); 
    } catch (err) {
        throw new Error('Error applying for this job!');
    }
}

module.exports = {
    create,
    getAll,
    getById,
    edit,
    deleteItem,
    applyToOffer
}