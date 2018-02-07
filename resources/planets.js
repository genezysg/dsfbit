const logger = require('../logger')
const statuscode = require('http-status-codes');
const Planet = require('../models/planet.js');

const handleError= (error,res) => {
    res.send(statuscode.INTERNAL_SERVER_ERROR,error)
}

exports.list = (req,res,next) => {
    const traceid=logger.trace();
    var query=null;

    if (req.params.id) {
        query=Planet.findById(req.params.id)
    } else {
        query=Planet.find(req.query)
    }
    logger.info(traceid,'resources/planets.list - find',req.query)
    query.exec((err,planets) => {
        if (err) {
            handleError(err,res)
            logger.error(traceid,'resources/planets.list',err)

            return next();
        }
        logger.info(traceid,'resources/planets.list - found')
        res.send(planets)
        next()
    })
}


exports.get = (req,res,next) => {
    const traceid=logger.trace();

    logger.info(traceid,'resources/planets.get -find',req.param.id)
    query=Planet.findById(req.params.id)
    query.exec((err,planets) => {
        if (err) {
            handleError(err,res)
            logger.error(traceid,'resources/planets.get',err)

            return next();
        }
        planets.getAppearances()
        logger.info(traceid,'resources/planets.get -found',planets)
        res.send(planets)
        next()
    })
}

exports.post = (req,res,next) => {
    const traceid=logger.trace();
    const np = new Planet(req.body);

    logger.info(traceid,'resources/planets.post - body',req.body)
        np.save((err,saved) => {
            if (err) {
                handleError(err,res)
                logger.error(traceid,'resources/planets.post',err)

                return next();
            }
            saved.getAppearances()
            logger.info(traceid,'resources/planets.post - saved',saved)
            res.send(statuscode.CREATED,saved)
            next()
        })
}

exports.update = (req,res,next) => {
    const traceid=logger.trace();

    logger.info(traceid,'resources/planets.update - id',req.params.id,req.body)
        Planet.findById(req.params.id,(err,planet) => {
            if (err) {
                handleError(err,res)

                return next();
            }
            planet.set(req.body)
            planet.save((errup,updatedPlanet) => {
                if (errup) {
                    handleError(err,res)
                    logger.error(traceid,'resources/planets.updated',err)

                    return next();
                }
                updatedPlanet.getAppearances()
                logger.info(traceid,'resources/planets.updated',updatedPlanet)
                res.send(updatedPlanet)
                next()
            })
        })
}

exports.delete = (req,res,next) => {
    const traceid=logger.trace();

    logger.info(traceid,'resources/planets.delete - delete',req.params.id)
    Planet.remove({_id:req.params.id},(err) => {
        if (err) {
            logger.info(traceid,'resources/planets.delete - notfound')
            res.send(statuscode.NOT_FOUND)

            return next()
        }
        logger.info(traceid,'resources/planets.delete - deleted',req.params.id)
        res.send(statuscode.NO_CONTENT)
        next()
    })
}
