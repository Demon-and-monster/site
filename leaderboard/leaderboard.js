const request = new XMLHttpRequest();
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        console.log(request.response);
        console.log("Succeed");
    }
    else {
        window.location.href = '/site/signin/signin.html';
        console.error('Error: Unable to fetch data');
    }
}
request.onerror = function () {
    console.error('Error: Network Error');
}

const ip = '10.10.12.74:8080'
const base64 = localStorage.getItem('Authorization');
request.open('GET', 'http://' + ip + '/leaderBoard'); 
request.setRequestHeader("Authorization", base64);
request.send();