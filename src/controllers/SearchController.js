const Dev = require('../models/Dev');

const parseStringAsArray = require('../utils/parseStringAsArray');

module.exports = {
    async index(req, res) {
        const { latitude, longitude, techs } = req.query;

        const techsArray = await parseStringAsArray(techs);
        const criteria = techs.length ?
        {
            techs: {$in: techsArray},
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000, // 10km
                }
            }
        } :
        {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                    $maxDistance: 10000, // 10km
                }
            }
        }

        const devs = await Dev.find(criteria);

        return res.json({ devs });
    }
}