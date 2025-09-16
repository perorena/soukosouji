const IdSeparator = '#';
const Root = '../img/';
const SuccessImageSrc = Root + 'clear.png';
const RengaImageSrc = Root + 'renga.png';
const BoxImageSrc = Root + 'box1.png';
const BoxFixImageSrc = Root + 'box2.png';
const PlayerRightImageSrc = Root + 'robot_soujiki_right.png';
const PlayerLeftImageSrc = Root + 'robot_soujiki_left.png';
const PlayerUpImageSrc = Root + 'robot_soujiki_up.png';
const PlayerDownImageSrc = Root + 'robot_soujiki_down.png';

//0:空間
//1:壁
//2:荷物
//3:ゴミ
//4:プレーヤー
const Space = 0;
const RengaWall = 1;
const Box = 2;
const Trash = 3;
const Player = 4;


// 問題データ指定
let dataNumber = document.getElementById("dataNumber");

// 問題変更時のイベントリスナー
dataNumber.addEventListener("change", drawingTable);

// 問題番号
let dataNo;

// 迷路データの個数
let maxRow;
let maxCol;

// ズーム値
let zoom = 1.0;

// セル幅
let cellWidth = 50;

// Webページのロードが完了した後に呼び出されるロードイベントを設定する
window.addEventListener("load", onLoad, false);

// キーが押されたときのリスナー
document.addEventListener('keydown', keyDown, false);

// 矢印キーアクション
function arrowAction(action){
    let player = document.getElementById('player');
    if(player != null){
        let pTd = player.parentNode;
        let colInx = pTd.cellIndex;
        let pTr = pTd.parentNode;
        let rowInx = pTr.rowIndex;

        // プレーや画像削除
        player.parentNode.removeChild(player);

        if(action == 'ArrowRight' && colInx < maxCol){
            let intTarget = soukoData[rowInx][colInx + 1];
            if(intTarget == Trash){
                // 押した側の隣のセルが「ゴミ」
                pTd = pTd.nextSibling;
                // ゴミ掃除
                trashClean(rowInx, colInx + 1);
            }
        }
        if(action == 'ArrowLeft' && colInx > 0){
            let intTarget = soukoData[rowInx][colInx - 1];
            if(intTarget == Trash){
                pTd = pTd.previousSibling;
                trashClean(rowInx, colInx - 1);
            }
        }
        if(action == 'ArrowDown' && rowInx < maxRow){
            let intTarget = soukoData[rowInx + 1][colInx];
            if(intTarget == Trash){
                pTr = pTr.nextSibling;
                pTd = pTr.firstChild;
                for(let i=0; i < colInx; i++){
                    pTd = pTd.nextSibling;
                }
                trashClean(rowInx + 1, colInx);
            }
        }
        if(action == 'ArrowUp' && rowInx > 0){
            let intTarget = soukoData[rowInx - 1][colInx];
            if(intTarget == Trash){
                pTr = pTr.previousSibling;
                pTd = pTr.firstChild;
                for(let i=0; i < colInx; i++){
                    pTd = pTd.nextSibling;
                }
                trashClean(rowInx - 1, colInx);
            }
        }
        // 再描画
        if(pTd != null){
            // プレーヤー
            let img = document.createElement('img');
            img.setAttribute('id', 'player');
            img.setAttribute('class', 'sg');
            img.src = PlayerRightImageSrc;
            if(action == 'ArrowRight') img.src = PlayerRightImageSrc;
            if(action == 'ArrowLeft') img.src = PlayerLeftImageSrc;
            if(action == 'ArrowUp') img.src = PlayerUpImageSrc;
            if(action == 'ArrowDown') img.src = PlayerDownImageSrc;
            pTd.appendChild(img);
        }
        // クリア判定
        let clearFlag = true;
        let counter = 0;
        for(let i = 0; i < maxRow; i++){
            for(let j = 0; j < maxCol; j++){
                if(soukoData[i][j] == Trash) counter = counter + 1;
            }
        }
        if(counter > 0) clearFlag = false;
        if(clearFlag){
            let si = document.getElementById('successImage');
            si.style.display = 'block';
            let resetButton = document.getElementById('reset');
            resetButton.disabled = true;
            let leftButton = document.getElementById('lbtn');
            leftButton.disabled = true;
            let upButton = document.getElementById('ubtn');
            upButton.disabled = true;
            let downButton = document.getElementById('dbtn');
            downButton.disabled = true;
            let rightButton = document.getElementById('rbtn');
            rightButton.disabled = true;
        }
    }
}

// ゴミ削除（動き出した先）
function trashClean(rowInx, colInx){
    let idString = rowInx.toString() + IdSeparator + colInx.toString();
    let cell = document.getElementById(idString);
    cell.style.fontSize = '0px';
    cell.style.color = '';
    cell.textContent = '';
    soukoData[rowInx][colInx] = Space;
}

// キーが押されたとき
function keyDown(event){
    let strArrow = event.key;
    // BackSpace 8 Enter 13 テンキー 96～105 数字 48～57
    if(event.keyCode === 8 || event.keyCode === 13 ||
      (48 <= event.keyCode && event.keyCode <= 57) ||
      (96 <= event.keyCode && event.keyCode <= 105)) {
      return;
    }

    // ie11対応
    switch(event.key){
        case 'Left':
            strArrow = 'ArrowLeft';
            break;
        case 'Up':
            strArrow = 'ArrowUp';
            break;
        case 'Down':
            strArrow = 'ArrowDown';
            break;
        case 'Right':
            strArrow = 'ArrowRight';
            break;
    }
    event.preventDefault();
    arrowAction(strArrow);
}

// ボタンアクション設定
function makeButtonAction(){
    // イベント取得用ボタンオブジェクト取得
    let leftButton = document.getElementById('lbtn');
    let upButton = document.getElementById('ubtn');
    let downButton = document.getElementById('dbtn');
    let rightButton = document.getElementById('rbtn');

    // 左
    leftButton.addEventListener('touchend', function(event){
        event.preventDefault();
        arrowAction('ArrowLeft');
    });
    leftButton.addEventListener('click', function(event){
        event.preventDefault();
        arrowAction('ArrowLeft');
    });
    // 上
    upButton.addEventListener('touchend', function(event){
        event.preventDefault();
        arrowAction('ArrowUp');
    });
    upButton.addEventListener('click', function(event){
        event.preventDefault();
        arrowAction('ArrowUp');
    });
    // 下
    downButton.addEventListener('touchend', function(event){
        event.preventDefault();
        arrowAction('ArrowDown');
    });
    downButton.addEventListener('click', function(event){
        event.preventDefault();
        arrowAction('ArrowDown');
    });
    // 右ボタンタッチ
    rightButton.addEventListener('touchend', function(event){
        event.preventDefault();
        arrowAction('ArrowRight');
    });
    rightButton.addEventListener('click', function(event){
        event.preventDefault();
        arrowAction('ArrowRight');
    });

    // やり直す
    let resetButton = document.getElementById('reset');
    resetButton.addEventListener('touchend', function(event){
        event.preventDefault();
        drawingTable();
    });
    resetButton.addEventListener('click', function(event){
        event.preventDefault();
        drawingTable();
    });
}

// 動的作成
function makeTable(parentId){
    // 作成開始
    let rows=[];
    let table = document.createElement('table');
    table.setAttribute('id', 'souko');

    // 2次元配列の要素を格納
    for(let i = 0; i < maxRow; i++){
        rows.push(table.insertRow(-1));
        for(let j = 0; j < maxCol; j++){
            let cell = rows[i].insertCell(-1);
            // 空間の設定
            let idString = i.toString() + IdSeparator + j.toString();
            cell.setAttribute('id', idString);
            cell.style.backgroundColor = 'lightgray';
            cell.setAttribute('class', 'psg');  //画像表示のため、すべてのセルに設定する

            let intTarget = soukoData[i][j];
            // レンガ壁
            if( intTarget == RengaWall){
                let img = document.createElement('img');
                img.setAttribute('class', 'sg');
                img.src = RengaImageSrc;
                cell.appendChild(img);
            }
            // 荷物
            if( intTarget == Box){
                let img = document.createElement('img');
                img.setAttribute('class', 'sg');
                img.src = BoxImageSrc;
                cell.appendChild(img);
            }
            // 荷物
            if( intTarget == Trash){
                cell.style.fontSize = (cellWidth / 2).toString() +'px';
                cell.style.color = 'yellow';
                cell.textContent = '●';
            }
            // プレーヤー
            if( intTarget == Player){
                let img = document.createElement('img');
                img.setAttribute('id', 'player');
                img.setAttribute('class', 'sg');
                img.src = PlayerRightImageSrc;
                cell.appendChild(img);
                // 現在のプレーヤー位置を空間にする
                // プレーヤーは最初の表示だけに一筆データを利用し、その後は一筆データでは管理しない
                soukoData[i][j] = Space;
            }
        }
    }

    // 指定したdiv要素に迷路を加える
    document.getElementById(parentId).appendChild(table);
}

// HTML読み込み後、自動実行
function onLoad(){
    // ビューポートの設定
    UpdateViewport();

    // 迷路の動的作成
    drawingTable();

    // ボタンアクション設定
    makeButtonAction();
}

// 問題表示
function drawingTable(){
    // 成功イメージエリア削除
    let parent = document.getElementById('successImage');
    while(parent.firstChild){
      parent.removeChild(parent.firstChild);
    }
    // 描画エリア削除
    parent = document.getElementById('mainScreen');
    while(parent.firstChild){
      parent.removeChild(parent.firstChild);
    }

    // 初期化
    resetData();

    // 問題設定
    dataNo = parseFloat (dataNumber.value);
    //soukoData = soukoDataArray[dataNo - 1];   //これだとsoukoDataを書き換えると元のデータも書き換わるよ～ディープコピーが必要だ！
    soukoData = JSON.parse(JSON.stringify(soukoDataArray[dataNo - 1]));
    maxRow = soukoData.length;
    maxCol = soukoData[0].length;

    // 置き場所データ初期化
    //storagePlaceDataArray = [];

    // 表示サイズの計算
    zoomCalc();

    // 問題の動的作成
    makeTable('mainScreen');
}

// 初期化
function resetData(){
    // 成功画像非表示
    let si = document.getElementById('successImage');
    si.style.display = 'none';

    // ボタンの有効化
    let resetButton = document.getElementById('reset');
    resetButton.disabled = false;
    let leftButton = document.getElementById('lbtn');
    leftButton.disabled = false;
    let upButton = document.getElementById('ubtn');
    upButton.disabled = false;
    let downButton = document.getElementById('dbtn');
    downButton.disabled = false;
    let rightButton = document.getElementById('rbtn');
    rightButton.disabled = false;
}

// 表示倍率計算
function zoomCalc(){
    // 表示サイズの計算
    let mainScreen = document.getElementById('mainScreen');
    let bw = window.innerWidth;
    let bh = window.innerHeight - 180;
    let gridw = (soukoData[0].length + 1) * cellWidth;
    let gridh = (soukoData.length + 1) * cellWidth;

    // 表示倍率計算
    for(let i = 2; i > 0; i = i - 0.01){
      if( gridw * i < bw && gridh * i < bh){
        zoom = i;
        break;
      }
    }
    if(zoom < 0 || zoom > 1) zoom = 1.0;
    mainScreen.style.transformOrigin = 'top left';
    mainScreen.style.transform ='scale(' + zoom.toString() + ',' + zoom.toString() + ')';
    //alert("bw=" + bw + "  gridw=" + gridw * zoom + "  bh=" + bh + " gridh=" + gridh * zoom + " zoom=" + zoom);

    // 成功イメージ
    let successImageDiv = document.getElementById('successImage');
    successImageDiv.style.display = 'none';
    let img = document.createElement('img');
    img.setAttribute('id', 'simage');
    img.src = SuccessImageSrc;
    img.style.height = (gridh * zoom * 0.17).toString() + 'px'
    img.style.width = (gridw * zoom * 0.3).toString() + 'px'
    successImageDiv.appendChild(img);

}

function UpdateViewport() {
	let str_viewport;
	let str_ua = navigator.userAgent.toLowerCase();
	if (str_ua.indexOf('iphone') >= 0 || str_ua.indexOf('ipad') >= 0 || str_ua.indexOf('android') >= 0 && str_ua.indexOf('mobile') >= 0) {
		str_viewport = "width=475px";
	} else {
		str_viewport = "height=device-height";
	}
	document.querySelector("meta[name='viewport']").setAttribute("content", str_viewport);
}
