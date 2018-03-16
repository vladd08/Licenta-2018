const
    ObjectId = require('mongodb').ObjectID,
    debug = require('debug'),
    express = require("express"),
    crypto = require("../../../helpers/middlewares/crypto");
    User = require('../../../models/user');

class UserService {
    constructor(uow) {
        this.uow = uow;
    }

    getAll(callback) {
         this.uow.query('test','SELECT','','', null, {}, (result) => {
             return callback(result);
         });
    }

    getById(callback, id) {
        if(ObjectId.isValid(id)) {
            this.uow.query('test','SELECT','_id',ObjectId(id), null, {},(result) => {
                return callback(result, null);
            });
        } else {
            return callback(null,new Error("Invalid ID"));
        }
    }

    getByUsernameAndPassword(callback, username, password) {
        debug(password);
        this.uow.query('Users','SELECT', 'username' , username, null, {}, (result) => {
            let user = result;
            if(user[0] != undefined) {
                crypto.Verify(password, user[0].password, function(res) {
                    if(res) return callback(user[0]);
                    else return callback(new Error("Wrong credentials, please try again!!"));
                });
            } else {
                console.log('A');
                return callback(new Error("Username not found!"));
            }
        });
    }

    insertUser(callback, data) {
        let userSchema = this.uow.createUserModel();
        let mUow = this.uow;
            crypto.Hash(data.password, function(result){
                if(result instanceof Error) {
                    return callback(new Error("Hashing error!"));
                } else {
                    data.password = result;
                    let accessCode = data.accessCode;
                    mUow.query('Users', 'INSERT', '', '', userSchema, data, function(err, resp){
                        if(err) return callback(err);
                        else {
                            return callback(resp);
                        }
                    });
                 }
            });
    }

    insertAccessCardCode(callback, code) {

    }
}

module.exports = UserService;