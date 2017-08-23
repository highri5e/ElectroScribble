const fs = require('fs')


let NodeUtils = (function(){

    let utils = {};

    utils.fileExists = (filePath) => {

        fs.access(filePath, function(err) {
            if(err == null) {
                console.log('File exists');
            } else if(err.code == 'ENOENT') {
                // file does not exist
                console.log('file does not exist');
                fs.writeFile('log.txt', 'Some log\n');
            } else {
                console.log('Some other error: ', err.code);
            }
        });


    }

    module.exports = utils;

})()

