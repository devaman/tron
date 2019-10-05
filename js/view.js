const socket = new WebSocket('ws://localhost:7000');

// Connection opened
socket.addEventListener('open', function (event) {
    socket.send('Hello Serverasdasdas!');
    console.log(event);
    
});

// Listen for messages
socket.addEventListener('message', function (event) {
    console.log('Message from server ', event);
});
var View = function ($el) {
  this.$el = $el;
  // this.array = new Array2(100,70);
  this.myId = Math.random() * 10000;
  this.board = new Board(100, 70, this.myId);
  // speed depends on the difficulty setting
  this.speed = window.speed ? window.speed : 35;
  this.colorObj = Object.keys(this.board.players).map(d => {
    return { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) }
  })
  this.setupGrid();
};

View.prototype.startGame = function () {
  this.intervalId = window.setInterval(
    this.step.bind(this),
    this.speed
  );

  $(window).on("keydown", this.handleKeyEvent.bind(this));

  $(window).on("click", this.handleDifficultyChange.bind(this));
};

View.KEYS1 = {
  38: "N",
  39: "E",
  40: "S",
  37: "W"
};

// View.KEYS2 = {
//   87: "N",
//   68: "E",
//   83: "S",
//   65: "W"
// };

View.prototype.handleKeyEvent = function (event) {

  this.board.players[this.myId].turn(View.KEYS1[event.keyCode]);
  // Publish this keyEvent

};
View.prototype.subscribeToKeyEvents = function (id, keyCode) {
  if (id != this.myId)
    this.board.players[id].turn(View.KEYS1[keyCode]);
}

View.prototype.handleDifficultyChange = function (event) {
  // define the difficulty on the window so it persists through each game
  var target = event.target.className;
  if (target === "easy") {
    $('.easy').css('color', 'red');
    $('.medium').css('color', 'white');
    $('.hard').css('color', 'white');
    window.difficulty = 1;
    window.speed = 35;
  } else if (target === "medium") {
    $('.easy').css('color', 'white');
    $('.medium').css('color', 'red');
    $('.hard').css('color', 'white');
    window.difficulty = 2;
    window.speed = 30;
  } else if (target === "hard") {
    $('.easy').css('color', 'white');
    $('.medium').css('color', 'white');
    $('.hard').css('color', 'red');
    window.difficulty = 3;
    window.speed = 25;
  }
};

View.prototype.setupGrid = function () {
  var html = "";

  for (var i = 0; i < this.board.dimY; i++) {
    html += "<ul>";
    for (var j = 0; j < this.board.dimX; j++) {
      html += "<li></li>";
    }
    html += "</ul>";
  }

  this.$el.html(html);
  this.$li = this.$el.find("li");
};

View.prototype.step = function () {
  // if (this.board.players.alive && this.board.player2.alive) {
  //   this.board.player1.move();
  //   if (this.players === 2) {
  //     this.board.player2.move();
  //   } else {
  //     this.board.player2.computerMove();
  //   }
  Object.keys(this.board.players).map(d => {

    if (this.board.players[d].alive)
      this.board.players[d].move()
  })
  this.render();
  // } else {
  //   window.clearInterval(this.intervalId);
  //   $('#replay').show();

  //   if (this.players === 2) {
  //     if (this.checkWinner() === "Player 1") {
  //       $('#player1-win').show();
  //       window.wins.blue++;
  //     } else {
  //       $('#player2-win').show();
  //       window.wins.red++;
  //     }
  //   } else {
  //     if (this.checkWinner() === "Player 1") {
  //       $('#you-win').show();
  //       window.wins.blue++;
  //     } else {
  //       $('#computer-win').show();
  //       window.wins.red++;
  //     }
  //   }
  //   this.updateScore();
  // }
};

View.prototype.updateScore = function () {
  $('.red-wins').text(window.wins.red);
  $('.blue-wins').text(window.wins.blue);
};

View.prototype.render = function () {
  Object.keys(this.board.players).map((d, i) => {
    this.updateClasses(this.board.players[d].segments, this.colorObj[i])
  })

};

View.prototype.updateClasses = function (coords, color) {
  // find the index of each coord that will be in the jQuery array of li elements
  var self = this;
  coords.forEach(function (coord) {
    var coordIdx = (coord.i * self.board.dimX) + coord.j;
    self.$li.eq(coordIdx).css("background", `rgb(${color.r},${color.g},${color.b})`);
  });
};

View.prototype.checkWinner = function () {
  if (!this.board.player1.alive) {
    return "Player 2";
  } else {
    return "Player 1";
  }
};

// so linter doesn't yell at us
var Board = Board || {};