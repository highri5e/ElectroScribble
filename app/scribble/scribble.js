const _scribble = require('scribbletune')

var Scribble = (function(){

    // define the main object
    var scribble = {};

    function _createMidi(input) {
        var clip = _scribble.clip(input);     
        _scribble.midi(clip, './midi/notes_'+ input +'.mid');
    }

    
    // expose the function publicly
    scribble.createMidi = _createMidi;

    // export the module
    module.exports = scribble;
})()


