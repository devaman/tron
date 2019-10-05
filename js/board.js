var Board = function (dimX, dimY,myid) {
  this.dimX = dimX;
  this.dimY = dimY;
  this.board = Array(dimY).fill(0).map(x => Array(dimX).fill(0))
  // enter start coordinates as an array - [i, j]
  var myselfPos = [Math.floor(Math.random()*dimY/2), Math.floor(Math.random()*dimX)] ;
  
  // var player2StartPos = [Math.floor(dimY/2), Math.floor(dimX/8)];
  // this.player2 = new Bike(this, player2StartPos, "E");
  this.players = {
   [myid]:new Bike(this, myselfPos, "W",myid),
   18626:new Bike(this, [10,10], "E",18626),
   19781781:new Bike(this, [100,10], "E",19781781),
   197817823:new Bike(this, [10,60], "E",197817823),
   1978172:new Bike(this, [50,10], "E",1978172),
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
