let colorSelected = "red";
let boardState = [];
let selectMap = "BattleMap2.jpg";
let squareSize = 25;
let socket = io();
let infoappend = () => {
  CreateResetButton();
  AppendButton("Eraser","eraser","Eraser");
  AppendButton("Green","green","Green");
  AppendButton("Red","red","Red");
  AppendButton("Grey","grey","Grey");
  $(`#GridSize`)["0"].addEventListener("submit", function(e){
      e.preventDefault();
      let size = $(`#GridSize`)['0']['0']['value'];
      ChangeSquareSize(size);
    });
};

//This function creates a reset button in the information div
let CreateResetButton = () => {
  $(`#Information`).append(`</br><button id="ResetBoard">Reset</button>`);
  $(`#ResetBoard`).click(function(){ClearBoard()});
};

let ClearBoard = () => {
  $('.boardSquare').removeClass('green red grey');
};

//This function appends a button to the info panel
let AppendButton = (id,type,text) => {
  $('#Information').append(`</br><button id="${id}Button">${text}</button>`);
  $(`#${id}Button`).click(function(){
    SelectColor(type);
  });
};

//This function changes the currently selected color
let SelectColor = (color) => {
  colorSelected = color;
  console.log(`${color} selected!`);
};

let LoadAssets = () => {

};

//Obviously enough this changes the color of the square you pass it
let ChangeSquareColor = (id, color) => {
  console.log(id);
  $(`#${id}`).removeClass();
  $(`#${id}`).addClass('boardSquare');
  $(`#${id}`).addClass(color);
  $(`#${id}`).removeClass("eraser");
};

//This function creates the board according to certain parameters
async function CreateBoard (image) {
  console.log('beginning creation');
  $('#Board').append('<div id="Map" class="row"></div>');
  SetBoardImage(image);
  imageSize = await getBackgroundImageSize($('#Map'));
  let rows = imageSize.height/squareSize - imageSize.height/squareSize % 1;
  let columns = imageSize.width/squareSize - imageSize.width/squareSize % 1;
  console.log(rows);
  console.log(columns);
  for(i=0;i<columns;i++){
    boardState[i]=[];
    $('#Map').append(`<div class="boardColumn" id="Column_${i}"></div>`);
    for(let j=rows;j>0;j--){
      $(`#Column_${i}`).append(`<div class="boardSquare" id="Square_${i}_${j}"></div>`);
      boardState[i][j-1] = 0;
    };
  };
  $('.boardSquare').css("height", `${100/rows}%`);
  $('.boardColumn').css("width", `${100/columns}%`);
  $('.boardSquare').click(function(){
    socket.emit('SquareChange', {id:this.id, color:colorSelected});
  });
  console.log('board created!');
};

async function SetBoardImage (image){
  $('#Map').css("background-image", `url("/assets/images/${image}")`);
  let imageSize = await getBackgroundImageSize($('#Map'));
  console.log(imageSize);
  $('#Map').css("height", `${imageSize.height}px`);
  $('#Map').css("width", `${imageSize.width}px`);
  console.log('board image set!');
};

//Stolen from stackoverflow here: https://stackoverflow.com/questions/5106243/how-do-i-get-background-image-size-in-jquery
//Gets size of a background image
var getBackgroundImageSize = function(el) {
    var imageUrl = $(el).css('background-image').match(/^url\(["']?(.+?)["']?\)$/);
    var dfd = new $.Deferred();

    if (imageUrl) {
        var image = new Image();
        image.onload = dfd.resolve;
        image.onerror = dfd.reject;
        image.src = imageUrl[1];
    } else {
        dfd.reject();
    }

    return dfd.then(function() {
        return { width: this.width, height: this.height };
    });
};

let ChangeSquareSize = (size) => {
  console.log("size");
  console.log(size);
  squareSize = size;
  CreateBoard(selectMap);
};

let ChangeMap = (map) => {
  selectMap = map;
};

let initializeSockets = () => {
  socket.on('SquareChange', function(square){
    ChangeSquareColor(square.id,square.color);
  });
}

infoappend();
CreateBoard(selectMap);
initializeSockets();
