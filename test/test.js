const request = new XMLHttpRequest();
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        console.log(request.response);
        console.log("Succeed");
    }
    else {
        window.location.href = '/signin/signin.html';
        console.error('Error: Unable to fetch data');
    }
}
request.onerror = function () {
    console.error('Error: Network Error');
}

const base64 = localStorage.getItem('Authorization');
request.open('GET', 'http://localhost:8080/leaderBoard'); 
request.setRequestHeader("Authorization", base64);
request.send();