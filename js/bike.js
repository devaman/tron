var Bike = function (board, startPos, dir,id) {
  this.dir = dir;
  this.turning = false;
  this.board = board;
  this.alive = true;
  this.id = id;
  // this.opponent = null;

  var start = new Coord(startPos[0], startPos[1]);
  this.segments = [start];
};

Bike.DIFFS = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1)
};

Bike.prototype.isOccupying = function (coord) {
  var result = false;
  this.segments.forEach(function (segment) {
    if (segment.equals(coord)) {
      result = true;
    }
  });
  return result;
};

Bike.prototype.head = function () {
  return this.segments[this.segments.length - 1];
};

Bike.prototype.isValid = function(coord) {
  // check boundaries on board
  if (!this.board.validPosition(coord)) {
    console.log("out of board");
    
    return false;
  }
  // check if bike runs into itself
    if (this.board.board[coord.i][coord.j]==this.id) {
    console.log("ran itself");

      return false;
    }
  // check if bike runs into opponent
  if (this.board.board[coord.i][coord.j]!=0) {
    console.log("ran oponent"+this.board.board[coord.i][coord.j]);

    return false;
  }
  return true;
};

Bike.prototype.move = function () {
  var nextCoord = this.head().plus(Bike.DIFFS[this.dir]);
  this.turning = false;
  if (!this.isValid(nextCoord) ) {
    this.alive = false;
    return;
  }
  this.segments.push(nextCoord);
  this.board.Occupy(nextCoord,this.id);
};

Bike.prototype.turn = function (dir) {
  // don't allow user to turn directly around in opposite direction
  if (Bike.DIFFS[dir].isOpposite(Bike.DIFFS[this.dir]) || this.turning) {
    return;
  } else {
    this.turning = true;
    this.dir = dir;
  }
};

// so linter doesn't yell at us
var Coord = Coord || {};
