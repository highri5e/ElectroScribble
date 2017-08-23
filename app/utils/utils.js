
let Utils = (() => {

    let utils = {};

    // DOM manipulation
    //

    utils.hasClass = (el, className) => {
        if (el.classList)
          return el.classList.contains(className)
        else
          return !!el.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
    }
    
    utils.addClass = (el, className) => {
        if (el.classList)
            el.classList.add(className)
        else if (!hasClass(el, className)) el.className += " " + className
    }
    
    utils.removeClass = (el, className) => {
        if (el.classList)
            el.classList.remove(className)
        else if (hasClass(el, className)) {
            var reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
            el.className=el.className.replace(reg, ' ')
        }
    }


    // Arrays
    //

    utils.createArray = (len, content) => {
        return Array.apply(null, {length: len}).map(function(value, index){
            return content;
        });
    }

    utils.removeFromArray = (array, item) => {
        var index = array.indexOf(item);
        if (index > -1) {
            array.splice(index, 1);
        }
    }



    // Checks/Comparisons
    //

    utils.isNotNull = function(obj) {
        return (obj && obj !== 'null' && obj !== 'undefined') == true;
    }


    // HTTP
    //

    utils.ajax = function(method, url){ 
        // Return a new promise.
        return new Promise(function(resolve, reject) {
            // Do the usual XHR stuff
            var req = new XMLHttpRequest();
            req.open('GET', url);
        
            req.onload = function() {
                // This is called even on 404 etc
                // so check the status
                if (req.status == 200) {
                // Resolve the promise with the response text
                resolve(req.response);
                }
                else {
                // Otherwise reject with the status text
                // which will hopefully be a meaningful error
                reject(Error(req.statusText));
                }
            };
        
            // Handle network errors
            req.onerror = function() {
                reject(Error("Network Error"));
            };
      
            // Make the request
            req.send();
        });
    }

    module.exports = utils;

})()