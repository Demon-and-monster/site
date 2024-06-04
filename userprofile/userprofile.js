// userprofile.js
const request = new XMLHttpRequest();
request.onload = function () {
    if (request.status >= 200 && request.status < 400) {
        const response = request.response.split(",");
        console.log(response)
        // Assuming the response has the following structure:
        // {
        //     "username": "admin",
        //     "id": "12345",
        //     "totalGames": 100,
        //     "wins": 60,
        //     "losses": 40,
        //     "avgTimePerGame": "10 minutes",
        //     "registrationDate": "2021-01-01"
        // }

        document.getElementById('player-name').textContent = response[0];
        document.getElementById('player-elo').textContent = response[1];
        document.getElementById('total-games').textContent = response[5];
        document.getElementById('wins').textContent = response[3];
        document.getElementById('losses').textContent = response[4];
        document.getElementById('registration-date').textContent = response[6];
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
request.open('GET', 'http://localhost:8080/userDetail?username=' + username, true); 
request.setRequestHeader("Authorization", localStorage.getItem('Authorization'));
request.send();