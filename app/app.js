const path = require('path');
const loadJsonFile = require('load-json-file');

const player = require('./modules/sf-player.js');
const scribble = require('./modules/scribble.js');
const sequencer = require('./modules/sequencer.js');
const keyboard = require('./modules/keyboard.js');

const Tone = require('tone');

const utils = require('./utils/utils.js');


(function(){

    let _instruments = [];
    let currentInstrument = player.defaultInstrument;

    let captureNotes = false;
    let notesPlayed = [];
    let sequence = [];

    // UI
    const body = document.querySelector('body');

    let notesPlayedText = document.getElementById('notes-played');
    notesPlayedText.innerText = '';

    // buttons
    let captureNotesBtn = document.getElementById('capture-notes');
    let generateMIDIBtn = document.getElementById('generate-midi');
    let playMIDIBtn = document.getElementById('play-midi');
    let clearScribbleBtn = document.getElementById('clear-scribble');
    
    let keyboardContainer = document.getElementById('keyboard');
    let sequencerContainer = document.getElementById('sequencer');


    //create a synth and connect it to the master output (your speakers)
    let synth = new Tone.Synth().toMaster();


    let midi;
    
    initializeMIDI(onMIDIMessage, onStateChange).then(midiAccess => {
        let midi = midiAccess;  
    });

    function initializeMIDI(onMIDIMessage, onStateChange) {

        return new Promise((resolve, reject) => {
            if (!navigator.requestMIDIAccess) {
                reject('No MIDI support in your browser...');
            } 
            navigator.requestMIDIAccess({sysex: false}).then(
                (midiAccess) => {
                    if (onMIDIMessage && typeof Function) {
                        var inputs = midiAccess.inputs.values();
                        // loop over all available inputs and listen for any MIDI input
                        for (var input = inputs.next(); input && !input.done; input = inputs.next()) {
                            // each time there is a midi message call the onMIDIMessage function
                            input.value.onmidimessage = onMIDIMessage;
                        }
                    }
                    if (onStateChange && typeof Function) {
                        midiAccess.onstatechange = onStateChange;
                    }
                    resolve(midiAccess)
                },
                (e) => { reject(e) }
            );
        });

    }

    function onMIDIMessage(midiMessageEvent) {
        //console.log(midiMessageEvent)
        let data, cmd, channel, type, note, velocity;

        data = event.data,
        cmd = data[0] >> 4,
        channel = data[0] & 0xf,
        type = data[0] & 0xf0, // channel agnostic message type. Thanks, Phil Burk.
        note = data[1],
        velocity = data[2];
        // with pressure and tilt off
        // note off: 128, cmd: 8 
        // note on: 144, cmd: 9
        // pressure / tilt on
        // pressure: 176, cmd 11: 
        // bend: 224, cmd: 14
    
        switch (type) {
            case 144: // noteOn message 
                 noteOn(note, velocity);
                 break;
            case 128: // noteOff message 
                noteOff(note, velocity);
                break;
        }
    
        //console.log('data', data, 'cmd', cmd, 'channel', channel);
    }

    function noteOn(midiNote, velocity) {
        //let chord = Tone.Frequency(midiNote).harmonize([0, 5, 7])
        synth.triggerAttack(midiNote);
    }
    
    function noteOff(midiNote, velocity) {
        synth.triggerRelease()
        //synth.releaseAll()
    }

    function onStateChange(event) {
        var port = event.port,
            state = port.state,
            name = port.name,
            type = port.type;
        if (type == "input") console.log("name", name, "port", port, "state", state);
    }







    function playTone(key) {
        //play a middle 'C' for the duration of an 8th note
        synth.triggerAttackRelease(key, "8n");
    }

    
    

    keyboardContainer.addEventListener('keyboard.drawn', function(){
        // handle playing notes

        body.addEventListener('keyup', (e) => {
            console.log(e.which)
            playTone(e.which)
        })


        keyboardContainer.addEventListener('click', function(e){
            let elem = e.target;
            var key = elem.getAttribute('data-key');
            let note = elem.getAttribute('data-note');
            console.log(key)
            if (key) {
                playTone(note)
            }

            // if (player.ready){
            //     player.play(key);


            // }

            if(captureNotes) {
                let note = elem.getAttribute('data-note');
                notesPlayed.push(note);
                document.getElementById('notes-played').innerText = ` ${notesPlayed}`;
            }
        }) 
    });


    // draw the keyboard and the sequencer
    keyboard.draw(keyboardContainer);
    sequencer.drawSequencer(sequencerContainer);


    function playChord(notes){
        
        let keys = [];

        for (var index = 0; index < notes.length; index++) {  
            keys.push(keyboardContainer.querySelector(`.key span[data-note="${notes[index]}"]`));
        }
        for (var index = 0; index < keys.length; index++) {  
            keys[index].click();
            utils.addClass(keys[index], 'active'); 
        }
        setTimeout(function() {
            for (var index = 0; index < keys.length; index++) {  
                utils.removeClass(keys[index], 'active'); 
            }
        }, 2000);

    }



    document.getElementById('play-chord').addEventListener('click', function (e) {
        playChord(['c4', 'e4', 'g4']);
    })


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
            return;
        } 

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

    });


    playMIDIBtn.addEventListener('click', function(){
        MIDIjs.play(`.${ scribble.midiOutPath }`);
    })

    clearScribbleBtn.addEventListener('click', function(){
        // disable the play midi button
        utils.addClass(playMIDIBtn.parentNode, 'disabled');

    })


    // deal with rendering the instrument list and attach the listener

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



