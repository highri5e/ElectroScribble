const path = require('path')

const player = require('./modules/sf-player.js')
const scribble = require('./modules/scribble.js')
const sequencer = require('./modules/sequencer.js')
const keyboard = require('./modules/keyboard.js')
const MIDIPlayer = require('./modules/midi-player.js')

const utils = require('./utils/utils.js')
const nodeUtils = require('./utils/node-utils.js')

const loadJsonFile = require('load-json-file');

(function(){

    let _instruments = [];
    let currentInstrument = player.defaultInstrument;

    let captureNotes = false;
    let notesPlayed = [];
    let sequence = [];

    // UI
    let notesPlayedText = document.getElementById('notes-played');
    notesPlayedText.innerText = '';

    // buttons
    let captureNotesBtn = document.getElementById('capture-notes');
    let generateMIDIBtn = document.getElementById('generate-midi');
    let playMIDIBtn = document.getElementById('play-midi');
    let clearScribbleBtn = document.getElementById('clear-scribble');
    
    let keyboardContainer = document.getElementById('keyboard');
    let sequencerContainer = document.getElementById('sequencer');
    
    keyboardContainer.addEventListener('keyboard.drawn', function(){
        // handle playing notes
        keyboardContainer.addEventListener('click', function(e){
            let elem = e.target;
            var key = elem.getAttribute('data-key');
            if (player.ready){
                player.play(key);

                if(captureNotes) {
                    let note = elem.getAttribute('data-note');
                    notesPlayed.push(note);
                    document.getElementById('notes-played').innerText = ` ${notesPlayed}`;
                }
            }
        }) 
    });

    keyboard.draw(keyboardContainer);

    sequencer.drawSequencer(sequencerContainer);

    //scribble.getChords();
    //scribble.getScales();

    
    captureNotesBtn.addEventListener('click', function(e){
        
        // return if already capturing
        if (captureNotes) {
            return;
        } else {
            // clear notes
            notesPlayed.length = 0;
        }

        let $this = e.target.innerHTML = '<i class="fa fa-circle"></i> Capturing...';

        captureNotes = captureNotes == true ? false : true;
        notesPlayedText.innerText = 'ready...';
        console.log('capture notes: '+ captureNotes)
    })

    generateMIDIBtn.addEventListener('click', function(){
        
        let pattern = sequencer.getSequence();
        if (pattern.length == 0) {
            k$.growl({
                title: 'Warning!',
                text: 'Please select the Pattern.', // Optional
                delay: 3000, // Optional, 0 = forever
                type: 'alert-warn', // Optional
            })
        } else {

            scribble.createMidi({
                notes: notesPlayed,
                pattern: pattern
            })

            k$.growl({
                title: 'Success!',
                text: 'Your MIDI file was saved.', // Optional
                delay: 3000, // Optional, 0 = forever
                type: 'alert-success', // Optional
                id: 'token' // Optional
            });

            // enable the play midi button
            utils.removeClass(playMIDIBtn.parentNode, 'disabled');

            captureNotes = false;
            // update the capture notes button
            captureNotesBtn.innerHTML = '<i class="fa fa-microphone"></i> Capture Notes';

        }

    });


    playMIDIBtn.addEventListener('click', function(){

        MIDIjs.play('../midiout/clip.mid');

    })

    clearScribbleBtn.addEventListener('click', function(){

        // disable the play midi button
        utils.addClass(playMIDIBtn.parentNode, 'disabled');

    })



    loadJsonFile('./app/instruments/names.json').then(json => {
        _instruments = json;   
        renderInstruments(json);
    });

    function renderInstruments(instruments) {
        
        let list = document.getElementById('instruments-list');
        let listItems = [];

        instruments.forEach(function(instrument) {
            let cssClass = instrument.name === currentInstrument ? 'active' : '';
            listItems.push(`<li class="instrument ${cssClass}" data-instrument="${instrument.name}"><span>${instrument.displayName}</span></li>`);
        }, this);

        list.innerHTML += listItems.join('');

        list.addEventListener('click', function(e) {
            let elem = e.target.parentNode;
            let instrument = elem.getAttribute('data-instrument');

            // unstyle the current instrument in nav
            utils.removeClass(elem.parentNode.querySelector('li.active'), 'active');

            // style new instrument in nav
            utils.addClass(elem, 'active');
            player.changeInstrument(instrument);

            currentInstrument = elem.innerText;
        })
    }

})()



