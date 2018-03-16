const   
    express = require('express'),
    url = require('url'),
    debug = require('debug')('smart-office-api:server'),
    parser = require('body-parser'),
    UnitOfWork = require("../../../helpers/db/UnitOfWorkFactory"),
    jwt = require('jsonwebtoken'),
    UserService = require("../services/userService");

let router = express.Router();

router.get('/', function(req,res){
    res.json({"Response":"You accessed the users controller!"});
});

router.get('/test', function(req,res,next){
    let db = UnitOfWork.create((uow) => {
        if (uow instanceof Error) {
            next();
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

router.post('/login', function(req,res,next){
    let db = UnitOfWork.create((uow) => {
        if (uow instanceof Error) {
            next();
        } else {
            let data = new UserService(uow);
            let username = req.body.username;
            let password = req.body.password;
            data.getByUsernameAndPassword(function(resp){
                if(resp instanceof Error) {
                    res.status(401).json({"Error": "Wrong credentials, please try again!"});
                } else {
                    res.status(202).json({"Success:" : "User " + resp.username + " was logged in."});
                }
            }, username, password);
        }
    });
});

router.post('/register', function(req,res,next){
    let db = UnitOfWork.create((uow) => {
        if (uow instanceof Error) {
            next();
            // res.status(500).json({'Error' : "Internal server error : could not connect to the database!", "IssuedOn" : new Date()})
        } else {
            let data = new UserService(uow);
            debug('Body params', req.body);
            if (req.body.email &&
                req.body.username &&
                req.body.password &&
                req.body.sex && 
                req.body.accessCard) {
                        var userData = {
                        email: req.body.email,
                        username: req.body.username,
                        password: req.body.password,
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        age: req.body.age,
                        cnp: req.body.cnp,
                        sex: req.body.sex,
                        position: req.body.position,
                        address: req.body.address,
                        role: req.body.role,
                        accessCard: req.body.accessCard,
                        createdAt : Date.now()
                    };
                    debug('User data',userData);
                    data.insertUser((result,err) => {
                        if(err) {
                            err.status = 400;
                            next(err) ;
                        }
                        else {
                            if(result.errmsg) {
                                res.status(400).json({error: "There is an account associated with this username / email."});
                            } else if (res.errors) {
                                res.status(400).json({error: "Please fill all the required data."});
                            } else {
                                res.status(200).json("User " + result.firstname + " " + result.lastname + " was registered successfuly!");
                            }
                        }
                        uow.complete();
                    }, userData);
                } else {
                    return next("Please fill the form!");
                }
            }
      });
});

module.exports = router;