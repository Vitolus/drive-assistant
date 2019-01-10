/*-----------------------------
      Global variables
------------------------------*/
var commands = ["carica", "scarica", "informazioni", "crea", "elimina"];
var Commands = {
    CARICA: 0,
    SCARICA: 1,
    INFORMAZIONI: 2,
    CREA: 3,
    ELIMINA: 4,
    NONE: -1
};
var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var noteContent = '';

try {
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    var recognition = new SpeechRecognition();
}
catch(e) {
    console.error(e);
    $('.no-browser-support').show();
    $('.app').hide();
}

/*-----------------------------
  App buttons and input
------------------------------*/

$('#start-record-btn').on('click', function(e) {
    if (noteContent.length) {
        noteContent += ' ';
    }
    recognition.start();
    instructions.text('Voice recognition turned on.');
});

$('#pause-record-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Voice recognition turned off.');
});

$('#reset-btn').on('click', function(e) {
    recognition.stop();
    instructions.text('Presse the START RECOGNITION button to allow access');
    noteTextarea.val('');
    //azzera il contenuto registrato
    noteContent='';
    if (document.contains(document.getElementById("stud-img")))
        document.getElementById("stud-img").remove();
    if (document.contains(document.getElementById("demo")))
        document.getElementById("demo").remove();
});

$('#speak-btn').on('click', function(e) {
    var tempV=0;
    recognition.stop();
    sTalking();
    for(var i=0;i<noteContent.length;i++){
        tempV+=75;
    }
    readOutLoud(noteContent);

    setTimeout(fTalking, tempV);

});

// Sync the text inside the text area with the noteContent variable.
noteTextarea.on('input', function() {
    noteContent = $(this).val();
});