
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
	
	/**
	 * @param   {Element}     el
	 * @param   {string}      selector
	 * @return  {Element[]}
	 * Returns all immediate children of a given element which match a provided selector
	 */

	utils.children = function(el, selector) {
		var selectors      = null,
			children       = null,
			childSelectors = [],
			tempId         = '';

		selectors = selector.split(',');

		if (!el.id) {
			tempId = '_temp_';
			el.id = tempId;
		}

		while (selectors.length) {
			childSelectors.push('#' + el.id + '>' + selectors.pop());
		}

		children = document.querySelectorAll(childSelectors.join(', '));

		if (tempId) {
			el.removeAttribute('id');
		}

		return children;
	};
	
	
	/**
	 * @param   {Element}       el
	 * @param   {string}        selector
	 * @param   {boolean}       [includeSelf]
	 * @return  {Element|null}
	 * Returns the closest parent element to a given element matching the provided selector, 
	 * optionally including the element itself
	 */

	utils.closestParent = function(el, selector, includeSelf) {
		var parent = el.parentNode;

		if (includeSelf && el.matches(selector)) {
			return el;
		}

		while (parent && parent !== document.body) {
			if (parent.matches && parent.matches(selector)) {
				return parent;
			} else if (parent.parentNode) {
				parent = parent.parentNode;
			} else {
				return null;
			}
		}

		return null;
	};
	
	
	/**
	 * @param   {Element}   el
	 * @param   {string}    [selector]
	 * @return  {number}
	 * Returns the index of a given element in relation to its siblings, 
	 * optionally restricting siblings to those matching a provided selector
	 */
	

	utils.index = function(el, selector) {
		var i = 0;

		while ((el = el.previousElementSibling) !== null) {
			if (!selector || el.matches(selector)) {
				++i;
			}
		}

		return i;
	};


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