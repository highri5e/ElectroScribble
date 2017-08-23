const Soundfont = require('soundfont-player')

let Player = (() => {

    let _player = {
        audioContext: new AudioContext(),
        soundfontPlayer: {},
        ready: false,
        defaultInstrument: 'acoustic_grand_piano'
    };
    
    let init = () => {
        // initialize the soundfont player
        initializeSoundfontPlayer(_player.defaultInstrument);
    }
    
    function initializeSoundfontPlayer(instrument) {
        Soundfont.instrument(_player.audioContext, instrument).then(function (instr) {
            _player.soundfontPlayer = instr;
            _player.ready = true;
        });
    }
    
    // override the play function
    _player.play = (note) => {
        _player.soundfontPlayer.play(note);
    }

    
    _player.changeInstrument = (instrument) => {
        _player.soundfontPlayer.stop();
        _player.ready = false;
        initializeSoundfontPlayer(instrument);
    }


    _player.getInstrumentUrl = function(instrument) {
        return Soundfont.nameToUrl(instrument, null, 'mp3');
    }

    init();

    module.exports = _player;

})()



