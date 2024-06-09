async function postData(url, data) {
    // 檢查 username 和 password 是否為空
    if (!data.username || !data.password) {
        return -1;
    }

    // 將 username 轉換為小寫
    data.username = data.username.toLowerCase();

    // 檢查 username 是否包含 ',' 字符
    if (data.username.includes(',')) {
        return -1;
    }

    // 檢查 level 是否在允許範圍內
    if (data.level < 0 || data.level > 3) {
        return -1;
    }

    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                resolve(request.response);
            } else {
                console.log('err');
            }
        }
        request.onerror = function () {
            console.log('error');
        }
        request.open('POST', url, true); 
        request.setRequestHeader("Authorization", "Basic YWRtaW46cGFzc3dvcmQ=")
        request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        // request.setRequestHeader('Access-Control-Allow-Origin', '*');
        data = JSON.stringify(data)
        request.send(data);
    });
}

function registType(result) {
    if (result == 0) {
        return '註冊成功!';
    } else {
        return '使用者名稱已被使用或不符合格式';
    }
}

function submitForm(event) {
    event.preventDefault(); 
    
    const data = {
        username: document.getElementById("username").value.toLowerCase(),
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        level: 0
    };
    const ip = '192.168.1.203:8080'
    const base64 = 'Basic ' + btoa(data["username"]+':'+data["password"]);
    postData('http://' + ip + '/register', data)
        .then(responseData => {
            console.log(btoa("admin:password"))
            if (responseData == 0){
                localStorage.setItem('userName', document.getElementById("username").value);
                localStorage.setItem('Authorization', base64)
                window.location.href = '/site/index.html';
            }
            console.log(responseData);
            console.log(registType(responseData));
            result = registType(responseData);
            document.getElementById('resultText').textContent = result;
        });
}


