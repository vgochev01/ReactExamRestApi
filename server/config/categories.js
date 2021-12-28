const uniqid = require('uniqid');

const categories = {
    'architecture': 'Architecture and engineering',
    'culture': 'Arts, culture and entertainment',
    'business': 'Business, management and administration',
    'communications': 'Communications',
    'community': 'Community and social services',
    'education': 'Education',
    'scienceTech': 'Science and technology',
    'machinery': 'Installation, repair and maintenance',
    'farming': 'Farming, fishing and forestry',
    'government': 'Government',
    'health': 'Health and medicine',
    'law': 'Law and public policy',
    'sales': 'Sales'
}

module.exports = Object.entries(categories).map(category => {
    category[0] = {
        catId: uniqid(),
        value: category[0]
    };
    return category;
});