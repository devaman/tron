const ip = "10.2.88.236:7000"
const socket = new WebSocket(`ws://${ip}`);

let meta = {
  id: `${Math.random() * 10000}`,
  pos: [Math.floor(Math.random() * 70 / 2)+35, Math.floor(Math.random() * 100/2)+25],
  players: []
}
// Auto Start
var rootEl = $('.tron-game');
var time = $('#time');
const startin20sec = (dateNow) => {
  let sub = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate(), dateNow.getHours(), dateNow.getMinutes() + 1) - dateNow;
  let timer = sub;
  $(".end-display").hide();
  time.text(Math.ceil(sub / 1000))

  let interval = setInterval(() => {

    timer = timer - 1000;
    time.text(Math.ceil(timer / 1000).toString());
  }, 1000)
  setTimeout(() => {
    $(".start-display").hide();
    var view = new View(rootEl);
    view.startGame();
    clearInterval(interval);

  }, sub)
}

// Connection opened
socket.addEventListener('open', function (event) {
  socket.send(JSON.stringify({
    type: 0,
    id: meta.id,
    pos: meta.pos
  }));

});
window.onbeforeunload = function (event) {
  socket.send(JSON.stringify({ type: 3, id: meta.id }));
  socket.close();
};

socket.addEventListener('message', function (event) {
  const data = JSON.parse(event.data)
  console.log(data);

  if (data.type == 0) {
    if (meta.id !== data.id) {
      meta = {
        ...meta,
        players: meta.players.concat({
          id: data.id,
          pos: data.pos
        })
      }
      socket.send(JSON.stringify({
        type: 2,
        id: meta.id,
        pos: meta.pos,
        recId: data.id
      }));
    }
  } else if (data.type == 2 && data.recId == meta.id) {
    meta = {
      ...meta,
      players: meta.players.concat({
        id: data.id,
        pos: data.pos
      })
    }
  } else if (data.type == 3) {
    meta.players = meta.players.filter(function (obj) {
      return obj.id !== data.id;
    });
  }
  else if (data.type == 4) {
   let dateNow = new Date(data.time)
   startin20sec(dateNow);
  }
});

var View = function ($el) {
  this.$el = $el;
  // this.array = new Array2(100,70);

  this.myId = meta.id;

  this.board = new Board(100, 70, meta);
  // speed depends on the difficulty setting
  this.speed = 55;
  this.colorObj = Object.keys(this.board.players).map(d => {
    return { r: Math.floor(Math.random() * 255), g: Math.floor(Math.random() * 255), b: Math.floor(Math.random() * 255) }
  })
  $('#mycolor').css('background', `rgb(${this.colorObj[0].r},${this.colorObj[0].g},${this.colorObj[0].b})`)
  $('#mycolor').text("My Color");
  socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data)

    if (data.type == 1) {
      // if (data.id !== meta.id)
      console.log(Math.floor(Date.now() - parseInt(data.timestamp)) + "ms" + data);

      $('#ping').text(Date.now() - parseInt(data.timestamp) + "ms")
      this.board.players[data.id].turn(View.KEYS1[parseInt(data.keyCode)]);
    }
  })
  this.setupGrid();
};

View.prototype.startGame = function () {
  let timer = 5;
  // $(".difficulty").show();
  // $(window).on("click", this.handleDifficultyChange.bind(this));
  $('#gametimer').text(timer);
  let interval = setInterval(() => {
    timer--;
    $('#gametimer').text(Math.abs(timer));
  }, 1000)
  setTimeout(() => {
    this.intervalId = window.setInterval(
      this.step.bind(this),
      this.speed
    );

  }, 5000)


  // Listen for messages

  $(window).on("keydown", this.handleKeyEvent.bind(this));

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


  // Publish this keyEvent
  socket.send(JSON.stringify({
    timestamp: Date.now(),
    type: 1,
    id: this.myId,
    keyCode: event.keyCode
  }))
  setTimeout(() => {
    this.board.players[this.myId].turn(View.KEYS1[event.keyCode]);
  }
    , 28)
};


// View.prototype.handleDifficultyChange = function (event) {
//   // define the difficulty on the window so it persists through each game
//   var target = event.target.className;
//   if (target === "easy") {
//     $('.easy').css('color', 'red');
//     $('.medium').css('color', 'white');
//     $('.hard').css('color', 'white');
//     window.difficulty = 1;
//     window.speed = 200;
//   } else if (target === "medium") {
//     $('.easy').css('color', 'white');
//     $('.medium').css('color', 'red');
//     $('.hard').css('color', 'white');
//     window.difficulty = 2;
//     window.speed = 100;
//   } else if (target === "hard") {
//     $('.easy').css('color', 'white');
//     $('.medium').css('color', 'white');
//     $('.hard').css('color', 'red');
//     window.difficulty = 3;
//     window.speed = 25;
//   }
// };

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
  let totalAlive = meta.players.length;
  let aliveID = null
  Object.keys(this.board.players).map(d => {

    if (this.board.players[d].alive) {
      this.board.players[d].move();
      aliveID = d;
    }
    else
      {
        if(meta.id === d){
          $('.end-display').show();
          $('#you-win').hide();
          $('#you-lose').show();
        }
        this.board.clearSegment(d,this);
        totalAlive--;
      }
  })
  this.render();
  // } else {
  if (!totalAlive) {
    window.clearInterval(this.intervalId);
    if (aliveID === meta.id){
      $('.end-display').show();
      $('#you-lose').hide();
      $('#you-win').show();
      socket.close();
    }
    else{
      $('.end-display').show();
      $('#you-win').hide();
      $('#you-lose').show();
      socket.close();

    }
    // setTimeout(() => {
    //   window.location.reload()
    // }, 5000)
  }
  //   $('#replay').show();

  //   if (this.players === 2) {
  //     if (this.checkWinner() === "Player 1") {
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
    self.$li.eq(coordIdx).css("box-shadow", `1px 1px 10px 2px rgb(${color.r},${color.g},${color.b})`);
  });
  // var coordIdN = coords[coords.length-1].i*self.board.dimX + coords[coords.length-1].j;
  // self.$li.eq(coordIdN).
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
