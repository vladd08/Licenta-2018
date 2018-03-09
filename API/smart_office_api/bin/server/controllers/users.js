const   
    express = require('express'),
    url = require('url'),
    debug = require('debug')('smart-office-api:server');
    UnitOfWork = require("../../../helpers/db/UnitOfWorkFactory"),
    UserService = require("../services/userService");

let router = express.Router();

router.get('/', function(req,res){
    res.json({"Response":"You accessed the users controller!"});
});

router.get('/test', function(req,res,next){
    let db = UnitOfWork.create((uow) => {
        if (uow instanceof Error) {
            next();
            // res.status(500).json({'Error' : "Internal server error : could not connect to the database!", "IssuedOn" : new Date()})
        } else {
            let data = new UserService(uow);
            data.getAll((result) => {
                debug('test result for GET is %s', JSON.stringify(result));
                res.status(200).json(result);
                uow.complete()
            });
        }
    });
});

router.get('/test/:id', function(req,res,next){
    let db = UnitOfWork.create((uow) => {
        if (uow instanceof Error) {
            next();
            // res.status(500).json({'Error' : "Internal server error : could not connect to the database!", "IssuedOn" : new Date()})
        } else {
            let data = new UserService(uow);
            let id = req.params.id;
            data.getById((result, err) => {
                if(err) {
                    err.status = 400;
                    next(err) ;
                }
                else res.status(200).json(result);
                uow.complete();
            }, id);
        }
    });
});

module.exports = router;