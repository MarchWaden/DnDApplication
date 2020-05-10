let socket = io();
let selectedCursor = "examine";
let selectedSquare = null;
let reset = 0;
let state = {};
let backgroundScalar = 1;
let requestState = () => {
  socket.emit('ClientRequestsState', user, game);
  console.log('requesting state');
}
let sendState = () => {
  socket.emit('AlterState', user, game, state);
  console.log('sending state to server');
}
let initializeSockets = () => {
  socket.on(`${game._id}UpdateState`, function(recievedState){
    console.log(recievedState);
    state = recievedState;
    updateBoard();
  });
}
function clearInner(node) {
while (node.hasChildNodes()) {
  clear(node.firstChild);
  }
}
function clear(node) {
  while (node.hasChildNodes()) {
    clear(node.firstChild);
  }
  node.parentNode.removeChild(node);
}
async function updateBoard () {
  if (document.getElementById("Map")){
    let board = document.getElementById("Map");
    clearInner(board);
  }
  if(reset==1){
    console.log('reset!')
    state.squares = [];
    reset = 0;
    sendState();
  }else{
    await createBoard();
    addEntities();
  }
}
let addEntities = () => {
  for(i=0;i<state.squares.length;i++){
        $(`#Square_${state.squares[i].i}_${state.squares[i].j}`).addClass(state.squares[i].Shape);
        console.log(state.squares[i].Shape);
        $(`#Square_${state.squares[i].i}_${state.squares[i].j}`).addClass(state.squares[i].Color);
        $(`#Square_${state.squares[i].i}_${state.squares[i].j}`).attr("name", state.squares[i].Name);
  }
}
let updateSize = () => {
  reset = 1;
  state.squareSize = document.getElementById('Size').value;
  sendState();
}
let updateImage = () => {
  reset = 1;
  state.image = document.getElementById('ImageURL').value;
  console.log(state.image);
  sendState();
}
async function createBoard (){
  if($("#Map")){
    console.log('no map');
    $('#Board').append(`<div id="Map"></div>`);
  }
  SetBoardImage(state.image);
  imageSize = await getBackgroundImageSize($('#Map'));
  let rows = imageSize.height/state.squareSize - imageSize.height/state.squareSize % 1;
  let columns = imageSize.width/state.squareSize - imageSize.width/state.squareSize % 1;
  for(i=0;i<columns;i++){
    $('#Map').append(`<div class="boardColumn" id="Column_${i}"></div>`);
    for(let j= rows;j>0;j--){
      $(`#Column_${i}`).append(`<div class="boardSquare" id="Square_${i}_${j}" i="${i}" j="${j}"></div>`);
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
  imageSize.width = imageSize.width*backgroundScalar;
  imageSize.height = imageSize.height*backgroundScalar;
  console.log(imageSize);
    $('#Map').css("height", `${imageSize.height}px`);
    $('#Map').css("width", `${imageSize.width}px`);
  console.log('board image set!');
};
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
function changeScale(){
  backgroundScalar = document.getElementById("ImageScale").value;
  console.log(document.getElementById("ImageScale").value);
  updateBoard();
}
let squareClick = (square) => {
  if(selectedCursor == "create"){
    let isOccupied = 0;
    for(i=0;i<state.squares.length;i++){
      if (state.squares[i].i == square.attributes.i.value && state.squares[i].j == square.attributes.j.value){
        isOccupied = 1;
      }
    }
    if (isOccupied == 0){
      let entity = {
        i: square.attributes.i.value,
        j: square.attributes.j.value,
        Shape: `${document.getElementById('ShapeSelect').value}`,
        Color: `${document.getElementById('ColorSelect').value}`,
        Name: `${document.getElementById('EntityName').value}`
      }
      state.squares.push(entity);
      sendState();
    }
  }else if (selectedCursor == "delete"){
    for(i=0;i<state.squares.length;i++){
      if (state.squares[i].i == square.attributes.i.value && state.squares[i].j == square.attributes.j.value){
        state.squares.splice(i, 1);
      }
    }
    sendState();
  }else if (selectedCursor == "move"){
    if (selectedSquare){
      for(i=0;i<state.squares.length;i++){
        if (state.squares[i].i == selectedSquare[0] && state.squares[i].j == selectedSquare[1]){
          let movedSquare = state.squares.splice(i, 1)[0];
          movedSquare.i = square.attributes.i.value;
          movedSquare.j = square.attributes.j.value;
          state.squares.push(movedSquare);
          console.log(movedSquare)
          sendState();
        }
      }
      selectedSquare = null;
    }else{
      for(i=0;i<state.squares.length;i++){
        if (state.squares[i].i == square.attributes.i.value && state.squares[i].j == square.attributes.j.value){
          selectedSquare = [square.attributes.i.value,square.attributes.j.value];
          console.log(selectedSquare);
        }
      }
    }
  }else if (selectedCursor == "examine"){
    console.log(square.attributes.i.value);
    console.log(square.attributes.j.value);
    if (square.attributes.name){
      document.getElementById('Information').innerHTML=`Info</br>X:${square.attributes.i.value} Y: ${square.attributes.j.value} </br> Name: ${square.attributes.name.value}`
    }else{
      document.getElementById('Information').innerHTML=`Info</br>X:${square.attributes.i.value} Y: ${square.attributes.j.value}`
    }
  }
}



//Create buttons according to saved info in game
let createButtons = () => {
  $('#ChangeImage').click(function(){updateImage()});
  $('#ChangeSize').click(function(){updateSize()});
  $('#Create').click(function(){selectedCursor = 'create'});
  $('#Delete').click(function(){selectedCursor = 'delete'});
  $('#Move').click(function(){selectedCursor = 'move'});
  $('#Examine').click(function(){selectedCursor = 'examine'});
  $('#ClearBoard').click(function(){reset=1; updateBoard(); console.log('beepboop');})
  $('#ChangeScale').click(function(){changeScale()});
  //add essential functions: create, delete, move, choose shape/color
}

function RunGame(){
  initializeSockets();
  requestState();
  createButtons();
}

RunGame();
