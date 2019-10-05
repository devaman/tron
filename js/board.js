
var Board = function (dimX, dimY,meta) {
  const arrayToObject = (array) =>
   array.reduce((obj, item) => {
     obj[item.id] = new Bike(this,item.pos,"W",item.id)
     return obj
   }, {})
  this.dimX = dimX;
  this.dimY = dimY;
  this.board = Array(dimY).fill(0).map(x => Array(dimX).fill(0))
  // enter start coordinates as an array - [i, j]
  
  // var player2StartPos = [Math.floor(dimY/2), Math.floor(dimX/8)];
  // this.player2 = new Bike(this, player2StartPos, "E");
  
  let data = arrayToObject(meta.players);
  console.log(data);
  
  this.players = {
   [meta.id]:new Bike(this, meta.pos, "W",meta.id),
   ...data
   
  }
 
    
  // ,...getOtherPlayers()];
  // this.Occupy(new Coord(myselfPos[0],myselfPos[1]),myid);
 
  // this.player1.opponent = this.player2;
  // this.player2.opponent = this.player1;

  // take the difficulty that was defined on a previous game if one exists
  this.difficulty = window.difficulty ? window.difficulty : 1;
};

Board.prototype.validPosition = function (coord) {
  return (coord.i >= 0 && coord.i < this.dimY) &&
         (coord.j >= 0 && coord.j < this.dimX);
};
Board.prototype.Occupy = function(coord,id){
  
  this.board[coord.i][coord.j] = id;
}

// so linter doesn't yell at us
var Bike = Bike || {};
