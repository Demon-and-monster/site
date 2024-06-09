function moveImage(move) {

    if(lastMove == move) return;
    
    lastMove = move;
    console.log(move)
    startPos = move.substring(0, 2);
    endPos = move.substring(2, 4);
    const start = document.getElementById(startPos);
    const end = document.getElementById(endPos);
    const eatImg = end.querySelector('img')
    // 使用 CSS 選擇器獲取 start 下的第一個 img 標籤
    const image = start.querySelector('img');

    if (!image) {
        console.error('No image found in start');
        return;
    }

    // 獲取 start 和 end 的邊界框
    const rect1 = start.getBoundingClientRect();
    const rect2 = end.getBoundingClientRect();

    // 計算 start 和 end 之間的水平和垂直距離
    const deltaX = rect2.left - rect1.left;
    const deltaY = rect2.top - rect1.top;

    // 設置圖片的 transform 屬性來進行移動
    image.style.transform = `translate(${deltaX}px, ${deltaY}px)`;

    // 當過渡動畫結束後，執行以下操作
    image.addEventListener('transitionend', () => {
        // 移除圖片的 transform 屬性，避免影響後續操作
        image.style.transform = '';
        
        // 添加 'hidden' 類，隱藏圖片
        // image.classList.add('hidden');
        
        // 將圖片節點從 start 移動到 end
        end.appendChild(image);
        if(eatImg){
            eatSound.play();
            eatImg.remove();
        }
        else{
            moveSound.play();
        }
        // 移除 'hidden' 類，使圖片在 end 中顯示出來
        // image.classList.remove('hidden');
    }, { once: true }); // 確保事件監聽器在執行一次後移除
    

}

async function getGameBoard(){
    return new Promise((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // console.log(request.response);
                if(request.response == -1) return;
                const moves = request.response;
                moveImage(moves.substring(moves.length-4));
                // lastMove = moves.substring(moves.length-4);
                // console.log(lastMove);
                // resolve(request.response);
            } else {
                console.log('err');
            }
        }
        request.onerror = function () {
            console.log('error');
        }
        request.open('GET', "http://" + ip + "/getGameBoard?gameNumber=-1", true); 
        request.setRequestHeader("Authorization", localStorage.getItem('Authorization'))
        request.send();
    });
}

async function makeMove(move){
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
        request.open('POST', "http://" + ip + "/action?action=" + move, true); 
        request.setRequestHeader("Authorization", localStorage.getItem('Authorization'))
        request.send();
    });
}



let onclickDiv = null;
let lastMove = null;
const ip = '192.168.1.203:8080'
const alphaArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
const numArray = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const imgDict = {
    "a0" : "rc", "b0" : "rh", "c0" : "re", "d0" : "rk", "e0" : "r", "f0" : "rk", "g0" : "re", "h0" : "rh", "i0" : "rc",

                 "b2" : "ra",                                                                 "h2" : "ra",
    "a3" : "rs",              "c3" : "rs",              "e3" : "rs",             "g3" : "rs",              "i3" : "rs",


    "a6" : "bs",              "c6" : "bs",              "e6" : "bs",             "g6" : "bs",              "i6" : "bs",
                 "b7" : "ba",                                                                 "h7" : "ba",

    "a9" : "bc", "b9" : "bh", "c9" : "be", "d9" : "bk", "e9" : "b", "f9" : "bk", "g9" : "be", "h9" : "bh", "i9" : "bc"
}
const board = document.getElementById('board');
for(let i = 0; i <= 9; i++){
    for(let j = 0; j < 9; j++){
        const div = document.createElement("div");
        div.id = alphaArray[j]+numArray[i];
        div.className = 'container';
        const node = board.appendChild(div);
        if(imgDict[div.id]){
            const img = document.createElement("img");
            img.src = '/site/images/chessImgs/' + imgDict[div.id] + '.png';
            document.getElementById(div.id).appendChild(img)
        }
        
    }
}

document.querySelectorAll('.container').forEach(div => {
    div.addEventListener('click', function() {
        // 切换 red-border 类
        
        if(onclickDiv){
            makeMove(onclickDiv+this.id)
                .then(responseData => {
                    if(responseData == 0 || responseData == 2 || responseData == 3){
                        // moveImage(onclickDiv, this.id)
                        let temp = document.getElementById(onclickDiv);
                        temp.classList.toggle('red-border');
                        // lastMove = onclickDiv+this.id;
                        onclickDiv = null;
                    }
                });
            if(onclickDiv == this.id){
                let temp = document.getElementById(onclickDiv);
                temp.classList.toggle('red-border');
                onclickDiv = null
            }
            
            // console.log(response)
            
        }
        else{
            this.classList.toggle('red-border');
            onclickDiv = this.id;
        }
        
    });
});

// sound data
var moveSound = new Audio('/site/sounds/move-self.mp3');
var eatSound = new Audio('/site/sounds/capture.mp3');

setInterval(getGameBoard, 500);