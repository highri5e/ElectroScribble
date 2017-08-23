const _scribble = require('scribbletune')

var Scribble = (function(){

    // define the main object
    var scribble = {};


    function _getChords() {

        console.log(_scribble.listChords());
    }

    function _getScales() {
        
        console.log(_scribble.scales);
    }


    function _createClip(input) {      
        return _scribble.clip(input);      
    }


    function _createMidi(input) {

        console.log(input)

        let clip = _scribble.clip(input);
        _scribble.midi(clip, './midiout/clip.mid');
    }

    
    // expose the function publicly
    scribble.createMidi = _createMidi;
    scribble.getChords = _getChords;
    scribble.getScales = _getScales;

    // export the module
    module.exports = scribble;
})()


