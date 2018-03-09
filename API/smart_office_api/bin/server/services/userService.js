const
    ObjectId = require('mongodb').ObjectID;
    express = require("express");

class UserService {
    constructor(uow) {
        this.uow = uow;
    }

    getAll(callback) {
         this.uow.query('test','',(result) => {
             return callback(result);
         });
    }

    getById(callback, id) {
        if(ObjectId.isValid(id)) {
            this.uow.query('test',ObjectId(id),(result) => {
                return callback(result, null);
            });
        } else {
            return callback(null,new Error("Invalid ID"));
        }
    }
}

module.exports = UserService;