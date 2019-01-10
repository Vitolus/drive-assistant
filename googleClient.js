var OAuth= {"web": {"client_id":"428013160797-m6q94gji87pbkbbco3qer0avu8ia4qhr.apps.googleusercontent.com",
        "project_id":"speechrecognitiongatedwarf",
        "auth_uri":"https://accounts.google.com/o/oauth2/auth",
        "token_uri":"https://www.googleapis.com/oauth2/v3/token",
        "auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs",
        "client_secret":"mbbBxYG55e3oW_hsCWofbufC"}
};

function handleClientLoad() {
    // Load the API's client and auth2 modules.
    // Call the initClient function after the modules load.
    gapi.load('client:auth2', initClient);
}

var GoogleAuth; // Google Auth object.
var SCOPE= 'https://www.googleapis.com/auth/drive';

function initClient() {
    gapi.client.init({
        'apiKey': 'AIzaSyDG1BBHdCrXWdYTKYnROjKvcteZFf19Tko',
        'clientId': OAuth.web.client_id,
        'scope': SCOPE,
        'discoveryDocs': ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest']
    }).then(function () {
        GoogleAuth = gapi.auth2.getAuthInstance();
        // Listen for sign-in state changes.
        GoogleAuth.isSignedIn.listen(updateSigninStatus);
        // Handle initial sign-in state. (Determine if user is already signed in.)
        var user = GoogleAuth.currentUser.get();
        setSigninStatus();
        // Call handleAuthClick function when user clicks on "Sign In/Authorize" button.
        $('#sign-in-or-out-button').click(function() {
            handleAuthClick();
        });
        $('#revoke-access-button').click(function() {
            revokeAccess();
        });
    });
}

function handleAuthClick() {
    if (GoogleAuth.isSignedIn.get()) {
        // User is authorized and has clicked 'Sign out' button.
        GoogleAuth.signOut();
    } else {
        // User is not signed in. Start Google auth flow.
        GoogleAuth.signIn();
    }
}

function revokeAccess() {
    GoogleAuth.disconnect();
}

function setSigninStatus(isSignedIn) {
    var user = GoogleAuth.currentUser.get();
    var isAuthorized = user.hasGrantedScopes(SCOPE);
    if (isAuthorized) {
        $('#sign-in-or-out-button').html('Sign out');
        $('#revoke-access-button').css('display', 'inline-block');
        $('#auth-status').html('You are currently signed in and have granted ' +
            'access to this app.');
    } else {
        $('#sign-in-or-out-button').html('Sign In/Authorize');
        $('#revoke-access-button').css('display', 'none');
        $('#auth-status').html('You have not authorized this app or you are ' +
            'signed out.');
    }
}

function updateSigninStatus(isSignedIn) {
    setSigninStatus();
}