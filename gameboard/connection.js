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

                    let response = request.response.split(',');
                    opponentName = response[0];
                    if(response[1] == '0') isBlack = true;
                    else isBlack = false;
                    gameStart = 1;
                    connectionResult = 1;

                    clearInterval(checkConnectionId);
                }
                
                // resolve(request.response);
            } else {
                console.log('err');
            }
        }
        request.onerror = function () {
            console.log('error');
        }
        request.open('GET', "http://" + ip + "/lineup"); 
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
                let response = request.response.split(',');
                let topStatus = document.getElementsByClassName('game-status')[0];
                topStatus.replaceChildren();
                if(request.response == -1){
                    let win = document.createElement("span");
                    win.innerHTML = "對方已投降 恭喜獲勝";
                    topStatus.appendChild(win);
                    clearInterval(getGameStatusId);
                    return;
                }
                
                
                let red = document.createElement("span");
                let black = document.createElement("span");
                let turn = document.createElement("span");
                
                if(isBlack){
                    red.innerHTML = "紅方: " + opponentName;
                    black.innerHTML = "黑方: " + localStorage.getItem('userName') + " (您)";
                }
                else{
                    red.innerHTML = "紅方: " + localStorage.getItem('userName') + " (您)";
                    black.innerHTML = "黑方: " + opponentName;
                }
                if(response[1] == "false") turn.innerHTML = "輪到紅方"
                else turn.innerHTML = "輪到黑方"

                topStatus.appendChild(red);
                topStatus.appendChild(black);
                topStatus.appendChild(turn);
            } else {
                console.log('err');
            }
        }
        request.onerror = function () {
            console.log('error');
        }
        request.open('GET', "http://" + ip + "/getGameStats?gameNumber=-1"); 
        request.setRequestHeader("Authorization", base64)
        request.send();
    });
}

function leftConnection() {
    const request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            console.log(request.response)
            if(request.response == 0) window.location.href = '/site/index.html';
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
    request.open('POST', 'http://' + ip + '/leftLine'); 
    request.setRequestHeader('Authorization', base64);
    request.send();
}

function surrender() {
    const request = new XMLHttpRequest();
    request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
            console.log(request.response)
            if(request.response == 0) window.location.href = '/site/index.html';
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
    request.open('POST', 'http://' + ip + '/surrender'); 
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
        window.location.href = '/site/signin/signin.html';
        console.error('Error: Unable to fetch data');
    }
}
request.onerror = function () {
    console.error('Error: Network Error');
}

const ip = "192.168.1.203:8080"
let username = localStorage.getItem('userName');
if (username == null) username = 'admin';
request.open('POST', 'http://' + ip + '/lineup'); 
request.setRequestHeader("Authorization", base64);
request.send();

// check connection status
let gameStart = false;
let connectionResult = null;
const checkConnectionId = setInterval(checkConnection, 500);
const getGameStatusId = setInterval(getGameStatus, 500);

// game data
let isBlack = null; 
let opponentName = null;



window.addEventListener('beforeunload', function (event) {
    leftConnection();
    surrender();
});
