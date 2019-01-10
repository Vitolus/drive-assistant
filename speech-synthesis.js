/*-----------------------------
      Speech Synthesis
------------------------------*/

function readOutLoud(message) {
    var speech = new SpeechSynthesisUtterance();

    // Set the text and voice attributes.
    speech.text = message;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

function warn(student) {
    readOutLoud(student + " sei avvertito: non ti comportare più in questo modo.");
}