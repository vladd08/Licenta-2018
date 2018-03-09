class MongoUnitOfWork {
    constructor(db) {
        this.client = db;
        this.db = this.client.db();
    }

    query(collection,query,callback) {
        this.db.collection(collection).find(query).toArray(function(err,results) {
            if (err) this.db.rollback();
            return callback(results);
        });
    }

    complete() {
        this.client.close();
    }
}

module.exports = MongoUnitOfWork;