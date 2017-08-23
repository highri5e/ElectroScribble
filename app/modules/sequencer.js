
const utils = require('.././utils/utils.js')

let Sequencer = (function(){

    let _sequencer = {
        bars: 16,
        selectedBars: [],
        pattern: ''
    };


    let _generate = () => {
        let bars = [];
        for (var index = 0; index < _sequencer.bars; index++) {
            bars.push(`<li class="bar" data-bar="${index}"></li>`);     
        }
        return bars.join('');
    }

    _sequencer.drawSequencer = (obj) => {

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
        container.dispatchEvent(new Event('rendered'));

        container.addEventListener('click', function(e){               
            let elem = e.target;
            let bar = elem.getAttribute('data-bar');

            if (utils.hasClass(elem, 'on')) {
                utils.removeClass(elem, 'on')
                _sequencer.unselectBar(bar)
            } else {
                utils.addClass(elem, 'on');
                _sequencer.selectBar(bar)
            }
        });

    }


    _sequencer.addBar = function(){
        this.bars++;
        container.dispatchEvent(new Event('bar_added'));
    }

    _sequencer.removeBar = function(){
        this.bars--;
        container.dispatchEvent(new Event('bar_removed'));
    }

    _sequencer.selectBar = function(bar){
        this.selectedBars.push(bar);
        console.log(this.selectedBars)
        container.dispatchEvent(new Event('bar_selected'));
    }

    _sequencer.unselectBar = function(bar){
        utils.removeFromArray(this.selectedBars, bar);
        container.dispatchEvent(new Event('bar_unselected'));
    }

    _sequencer.getSequence = function(){
        
        let on = 'x';
        let extend = '_';
        let off = '-';

        if (this.selectedBars.length > 0) {
            // create array with 16 elements of '-'
            let pattern = utils.createArray(16, '-')
            let patternLength = this.bars -1;

            this.selectedBars.sort(function(a, b){return a - b});
            for (var index = 0; index < this.selectedBars.length; index++) {  
                pattern.splice(this.selectedBars[index], 1, on);
            }
    
            this.pattern = pattern.join('');
            return this.pattern;
        }

        return '';
    }

    module.exports = _sequencer;

})()