let devConfig = {
    hostname: process.env.HOST_NAME || 'localhost',
    port: process.env.HOST_NAME || 3000, 
    dbconfig : {
        dbType: 'mongodb',
        host: '@ds161148.mlab.com:61148',
        user: 'admin',
        password: 'Par0la01',
        database: 'intimesoftware'
    }
};

module.exports = devConfig;