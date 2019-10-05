var Array2 = function(dimX,dimY){
  this.board = Array(dimX).fill(0).map(x => Array(dimY).fill(0))
    
}
Array.prototype.Occupy = function(coord,id){
    this.board[coord.i][coord.j] = id;
  }