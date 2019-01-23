const _scribble = require('scribbletune')

let Scribble = (function(){

    const _midiOutPath = './midiout/clip.mid';

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
        _scribble.midi(clip, _midiOutPath);
    }

    
    // expose the function publicly
    scribble.createMidi = _createMidi;
    scribble.getChords = _getChords;
    scribble.getScales = _getScales;
    scribble.midiOutPath = _midiOutPath;

    // export the module
    module.exports = scribble;

})()


