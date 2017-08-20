const Soundfont = require('soundfont-player')
const scribble = require('./scribble/scribble.js')
const loadJsonFile = require('load-json-file');

window.$ = window.jQuery = require('jquery');

let instrumentNames = [];
let player = {};

Soundfont.instrument(new AudioContext(), 'acoustic_grand_piano').then(function (piano) {
    player = piano;
})


$(function(){

    function loadInstruments(instruments){

        var list = $('#instruments-list');
        var listItems = [];
        $.each(instruments, function(index, instrument){ 
            listItems.push('<span class="nav-group-item" data-instrument="'+instrument+'">' + instrument + '</span>');
        })
        list.append(listItems);
    }

    loadJsonFile('./app/instruments/names.json').then(json => {    
        loadInstruments(json);
     });

    


    $('.notes-container').on('click', 'div.note', function(){
        var note = $(this).data('note');
        player.play(note);

    }) 





})



