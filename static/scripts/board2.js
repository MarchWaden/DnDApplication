let squareSize = 25;
let image = "/assets/images/BattleMap.jpg";
let cursorFunction = "";
var selectedAction = "";
let selected;
let socket = io();
var state = {};
let requestState = () => {
  socket.emit('ClientRequestsState', user, game);
  console.log('requesting state');
}
let initializeSockets = () => {
  socket.on(`${game._id}UpdateState`, function(recievedState){
    console.log(recievedState);
    state = recievedState;
    if(state.image){
      image = state.image;
    }
    updateBoard();
  });
}
async function createBoard (){
  $('#Board').append(`'<div id="Map"></div>'`);
  SetBoardImage(image);
  imageSize = await getBackgroundImageSize($('#Map'));
  let rows = imageSize.height/squareSize - imageSize.height/squareSize % 1;
  let columns = imageSize.width/squareSize - imageSize.width/squareSize % 1;
  for(i=0;i<columns;i++){
    $('#Map').append(`<div class="boardColumn" id="Column_${i}"></div>`);
    for(let j= rows;j>0;j--){
      $(`#Column_${i}`).append(`<div class="boardSquare" id="Square_${i}_${j}"></div>`);
    };
  };
  $('.boardSquare').css("height", `${100/rows}%`);
  $('.boardColumn').css("width", `${100/columns}%`);
  $('.boardSquare').click(function(){squareClick(this)});
  console.log('board created!');
};
async function SetBoardImage (image){
  $('#Map').css("background-image", `url("${image}"`);
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

let updateBoard = () => {
  let occupied = $(".occupied");
  for(let i = 0;i<occupied.length;i++){
    occupied[i].removeAttribute("backgroundImage");
    occupied[i].removeAttribute("backgroundColor");
    occupied[i].removeClass("occupied");
    occupied[i].removeAttribute("entity");
  }
  for(let i=0;i<state.entities.length;i++){
    let entity = state.entities[i]
    let square = document.getElementById(`Square_${entity.i}_${entity.j}"></div>`);
    if(entity.backgroundImage){
      square.backgroundImage = `url:('${entity.backgroundImage}')`;
      square.addClass("occupied");
      square.entity = i;
    }else if (entity.backgroundColor){
      square.backgroundColor = entity.backgroundColor;
      square.addClass("occupied")
      square.entity = i;
    }else {
      square.backgroundColor = "red";
      square.addClass("occupied");
      square.entity = i;
    }
  };
};
let addDMFunctions = () => {
  $(`#DMConsole`).append(`<button id="CreationButton">Create Entity</button>`);
  $(`#CreationButton`).click(function(){createEntity()});
}
let displayEntity = (entity) => {
  $("#Information").innerHTML=entity.name;
};
let squareClick = (square) => {
  console.log('square was clicked');
  console.log(cursorFunction);
  if (cursorFunction == "Select"){
    selected = square;
    cursorFunction = selectedAction;
    if(square.entity){
      displayEntity(state.entities[square.entity]);
    }
  }else if (cursorFunction == "Move"){
    socket.emit("requestSquareChange", state.entites[selected.entity], square);
  }else if (cursorFunction == "CreateEntity"){
    console.log("Creating Entity Maybe?")
    console.log(square);
    createEntity(square);
  }
}
let createEntity = () => {
  console.log('yolo');
  selectedAction = "CreateEntity";
}
addDMFunctions();
initializeSockets();
requestState();
createBoard();
