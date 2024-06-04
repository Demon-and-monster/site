async function checkConnection() {
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                console.log(request.response);
                connectionResult = request.response;
                if(connectionResult == 0 || connectionResult == -1){
                    let span = document.getElementById('connection-status')
                    if(span.textContent.length >= 8){
                        span.textContent = span.textContent.substring(0, 5);
                    }
                    else{
                        span.textContent += '.';
                    }
                }
                else{
                    let span = document.getElementById('connection-status');
                    span.textContent = '找到對手!';
                    let button = document.getElementById('action-button');
                    button.textContent = '投降';
                    button.onclick = surrender;

                    clearInterval(checkConnectionId);
                    gameStart = 1;
                    connectionResult = 1;
                }
                
                // resolve(request.response);
            } else {
                console.log('err');
            }
        }
        request.onerror = function () {
            console.log('error');
        }
        request.open('GET', "http://localhost:8080/lineup"); 
        request.setRequestHeader("Authorization", base64)
        request.send();
    });
}

async function getGameStatus() {
    if(connectionResult != 1) return;
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                console.log(request.response);
                resolve(request.response);
            } else {
                console.log('err');
            }
        }
        request.onerror = function () {
            console.log('error');
        }
        request.open('GET', "http://localhost:8080/getGameStats?gameNumber=-1"); 
        request.setRequestHeader("Authorization", base64)
        request.send();
    });
}

function leftConnection() {
    const request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            console.log(request.response)
            if(request.response == 0) window.location.href = '/';
            // console.log('Waiting for opponent')
        }
        else {
            console.error('Error: Unable to fetch data');
        }
    }
    request.onerror = function () {
        console.error('Error: Network Error');
    }

    let username = localStorage.getItem('userName');
    if (username == null) username = 'admin';
    request.open('POST', 'http://localhost:8080/leftLine'); 
    request.setRequestHeader('Authorization', base64);
    request.send();
}

function surrender() {
    const request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            console.log(request.response)
            if(request.response == 0) window.location.href = '/';
            // console.log('Waiting for opponent')
        }
        else {
            console.error('Error: Unable to fetch data');
        }
    }
    request.onerror = function () {
        console.error('Error: Network Error');
    }

    let username = localStorage.getItem('userName');
    if (username == null) username = 'admin';
    request.open('POST', 'http://localhost:8080/surrender'); 
    request.setRequestHeader('Authorization', base64);
    request.send();
}

// start connection

const base64 = localStorage.getItem('Authorization');

const request = new XMLHttpRequest();
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
    }
    else {
        window.location.href = '/signin/signin.html';
        console.error('Error: Unable to fetch data');
    }
}
request.onerror = function () {
    console.error('Error: Network Error');
}

let username = localStorage.getItem('userName');
if (username == null) username = 'admin';
request.open('POST', 'http://localhost:8080/lineup'); 
request.setRequestHeader("Authorization", base64);
request.send();

// check connection status
let gameStart = false;
let connectionResult = null;
const checkConnectionId = setInterval(checkConnection, 500);
const getGameStatusId = setInterval(getGameStatus, 500);

window.addEventListener('beforeunload', function (event) {
    leftConnection();
});