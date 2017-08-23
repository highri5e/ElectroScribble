
let Keyboard = (function drawPiano() {

    let keyboard = {}

    let _generate = function(){
    
        let octaves = 8 // how many octaves to draw  
        let oct = 2; // start at octave 2
        let key = 24; // start at key
        let keys = ['c', 'd', 'e', 'f', 'g', 'a', 'b'];
        let sharps = ['c', 'd', 'f', 'g', 'a']; // which keys have sharps/flats
        
        // all keys in HTML
        let allKeys = [];
    
        // for each octave generate the keys
        for (var i = 3; i <= octaves; i++) {
            
            let octaveKeys = [];
            let htmlKey = [];
    
            // go through the key notes start form 3rd octave
            for (var index = 0; index < keys.length; index++) {
                
                let halfSteps = [];           
                // for each half step
                for (var s = 0; s < 2; s++) {
                    // in octave 10 there's only c -> g
                    if (i == 10) {
                        keys = ['c', 'd', 'e', 'f', 'g'];
                        sharps = ['c', 'd', 'f'];
                    }
    
                    let hasSharp = sharps.indexOf(keys[index]) > -1;
                    let isSharp = s == 0 ? false : true;
                    let cssClass = isSharp ? 'black-key' : 'white-key'
                    let noteSig = isSharp ? `${keys[index]}#${oct}` : `${keys[index]+oct}`
                    let isMiddleC = noteSig.toLowerCase() == 'c4'

                    // add id for middle C
                    let middleCID = isMiddleC ? 'middle-c' : '';
    
                    let halfStep = ``;
                    if (isSharp && hasSharp || !isSharp) {
                        halfStep = `<span class="${cssClass}" id="${middleCID}" data-key="${key}" data-note="${noteSig}"></span>`
                        key++;
                    } 
    
                    halfSteps.push(halfStep);
                    
                }
    
                let wholeKey = `<li class="key">${halfSteps.join('')}</li>`
    
                octaveKeys.push(wholeKey);                   
            }
    
            oct++;
            allKeys.push(octaveKeys.join(''));
        }
    
        return allKeys.join('');
    }

    let _draw = function(obj){
        
        if (typeof obj === 'string') {
            container = document.getElementById(obj);
            if (!utils.isNotNull(container)) {
                console.error('Sequencer: could not find element with the specified selector: ', obj)
                return;
            }
        } 
        else if (utils.isNotNull(obj)) {
            container = obj;
        } else {
            console.error('Sequencer: null object passed')
            return;
        }

        container.innerHTML = _generate();
        // center the keyboard at middle C
        container.scrollLeft = document.getElementById('middle-c').parentNode.offsetLeft - container.offsetWidth / 2;
        container.dispatchEvent(new Event('keyboard.drawn'));
       
    }

    // expose the draw function
    keyboard.draw = _draw;

    module.exports = keyboard;


})();









