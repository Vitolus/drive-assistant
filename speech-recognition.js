/*-----------------------------
      Voice Recognition 
------------------------------*/

// If false, the recording will stop after a few seconds of silence.
// When true, the silence period is longer (about 15 seconds),
// allowing us to keep recording even when the user pauses. 
recognition.continuous = true;

// This block is called every time the Speech APi captures a line. 
recognition.onresult = function(event) {

  // event is a SpeechRecognitionEvent object.
  // It holds all the lines we have captured so far. 
  // We only need the current one.
  var current = event.resultIndex;

  // Get a transcript of what was said.
  var transcript = event.results[current][0].transcript;

  // Add the current transcript to the contents of our Note.
  // There is a weird bug on mobile, where everything is repeated twice.
  // There is no official solution so far so we have to handle an edge case.
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);

  if(!mobileRepeatBug) {
      noteContent += transcript;
      noteTextarea.val(noteContent);
      interpret(noteContent);
  }
};

recognition.onspeechend = function() {
    if (! instructions.valueOf() == 'Voice recognition turned off.')
        instructions.text('You were quiet for a while so voice recognition turned itself off.');
};

recognition.onerror = function(event) {
    if(event.error == 'no-speech')
        instructions.text('No speech was detected. Try again.');
};

//////////////////////////////////////////////////////////controllo sui comandi
/**
 *
@param String command
*/
function indexOfCommand(command){
    console.log("inizio indexOfCommand("+command+")");
    const command_min = command.toLocaleLowerCase();
    let j;
    for (j = 0; j < commands.length; j++){
        if (commands[j].toLocaleLowerCase().localeCompare(command_min) == 0){
            console.log("fine indexOfCommand("+command+")");
            return j;
        }
    }
    console.log("fine indexOfCommand("+command+")");
    return -1;
}
///////////////////////////////////////////////////////////////////////fine controllo


function getFileName(list) {
    list.shift();
    let stfile=''; // nome file
    for (let i = 0; i<list.length; stfile+=list[i], i++);
    stfile= stfile.toLowerCase();
    return stfile;
}

/**
 *
 * @param line
 */
function interpret(line) {
    let list = line.split(" ");
    let id='';
    let stfile= '';
    let mimeType= '';

    console.log("inizio interpret("+line+")");
    const i = indexOfCommand(list[0]);
    switch (i){
        case Commands.CARICA: //TODO select the file
            gapi.client.request({ // not able to choose a local file
                'method': 'POST',
                'path': 'upload/drive/v3/files?uploadType=resumable',
                'Content-Length': 38
            }).execute(function (response) {
                console.log(response);
            });
            break;

        case Commands.SCARICA: //not working - error 400
            id='';
            mimeType= '';
            stfile= getFileName(list);
            gapi.client.request({ // request the list of files
                'method': 'GET',
                'path': '/drive/v3/files'
            }).then(function(response) { // get the id of the file needed
                var files= response.result.files;
                for (let i= 0; i<files.length; i++){
                    if(stfile === files[i].name){
                        id= files[i].id;
                        mimeType= files[i].mimeType;
                        break;
                    }
                }
            }).then(function () {
                gapi.client.drive.files.export({
                    "fileId": id,
                    "mimeType": mimeType
                }).execute(function (response) {
                    console.log(response);
                });
            });
            break;

        case Commands.ELIMINA:
            id='';
            stfile= getFileName(list);
            gapi.client.request({ // request the list of files
                'method': 'GET',
                'path': '/drive/v3/files'
            }).then(function(response) { // get the id of the file needed
                var files= response.result.files;
                for (let i= 0; i<files.length; i++){
                    if(stfile === files[i].name){
                        id= files[i].id;
                        break;
                    }
                }
            }).then(function () { // request to delete the file
                gapi.client.request({
                    'method': 'DELETE',
                    'path': 'drive/v3/files/'+id
                }).execute(function (response) {});
            });
            break;

        case Commands.INFORMAZIONI:
            var request = gapi.client.drive.about.get({'fields': 'user'});
            request.execute(function(response) { // Execute the API request.
                var result= response.user.displayName + '\n' + response.user.emailAddress;
                alert(result);
            });
            break;

        default:
            alert("Comando non trovato.");
            break;
    }
    console.log("fine interpret("+line+")");
}
