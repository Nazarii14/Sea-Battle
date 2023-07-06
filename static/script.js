let currentData = {
  'message': "",
  'board1': [],
  'board2': [],
  'activePlayer': 1,
  'openedBoard1': [],
  'openedBoard2': [],
  'isGameEnded': false,
  'row': -1,
  'col': -1,
  'res': -1
}

window.onload = function() {
  startNewGame();
};

let regenerateButton1 = document.getElementById("regenerateButton1")
let regenerateButton2 = document.getElementById("regenerateButton2")

regenerateButton1.addEventListener('click', regenerateBoard1)

function regenerateBoard1() {
  return fetch('/regenerateBoard1')
    .then(response => response.json())
    .then(function(data) {
      currentData['board1'] = data['board1'];
      currentData['openedBoard1'] = data['openedBoard1']
      
      drawOpenedBoard1(currentData['openedBoard1'])
    });
}

function regenerateBoard2() {
  return fetch('/regenerateBoard2')
    .then(response => response.json())
    .then(function(data) {
      currentData['board2'] = data['board2'];
      currentData['openedBoard2'] = data['openedBoard2']
      
      drawOpenedBoard2(currentData['openedBoard2'])
    });
}

let cells1 = document.querySelectorAll('.board1 td');
let cells2 = document.querySelectorAll('.board2 td');

let confirmButton1 = document.getElementById('confirm1')
let confirmButton2 = document.getElementById('confirm2')

confirmButton1.addEventListener('click', confirmFunction1)
confirmButton2.addEventListener('click', confirmFunction2)

function confirmFunction1() {
  regenerateButton1.removeEventListener('click', regenerateBoard1);
  clearBoard(cells1);
  messageLabel.innerHTML = "Player 1, close your eyes. Player 2, choose your ships layout and click 'Confirm' when you finished."
  drawOpenedBoard2()
  confirmButton1.removeEventListener('click', confirmFunction1)
}

function confirmFunction2() {
  regenerateButton2.removeEventListener('click', regenerateBoard2)
  clearBoard(cells2);

  cells1.forEach(function(cell) {
    cell.addEventListener('click', fakeFunction);
  });

  cells2.forEach(function(cell) {
    cell.addEventListener('click', updateStatus);
  });

  arrowIcon.innerHTML = rightArrow;
  messageLabel.innerHTML = "Player 1, please shoot!"
  confirmButton2.removeEventListener('click', confirmFunction2);
}

function clearBoard(cells) {
  cells.forEach(function(cell) {
    while (cell.classList.length > 0) {
      let className = cell.classList.item(0);
      cell.classList.remove(className);
    }
    cell.classList.add('cleared')
  });
}

let messageLabel = document.getElementById("message")
let arrowIcon = document.getElementById('arrow')
let player1Label = document.getElementById('player1')
let player2Label = document.getElementById('player2')

let leftArrow = '<i class="bi bi-arrow-left"></i>'
let rightArrow = '<i class="bi bi-arrow-right"></i>'

let greenColor = 'rgb(4, 255, 0)'
let redColor = 'rgb(255, 0, 0)'

function updateStatus() {
  let shoot_col = this.cellIndex;
  let shoot_row = this.parentNode.rowIndex;

  handleShoot(shoot_row, shoot_col)
    .then(function (data) {
      return loadGameState();
    })
    .then(function (data) {
      messageLabel.innerHTML = data['message']['message'];
      disableEnableBoards(data['activePlayer']);
      drawGameState(data);

      if (messageLabel.innerHTML.includes("The game is ended!")) {
        disableCells(data['activePlayer']);
        return;
      }

      if (data['activePlayer'] == 0) {
        arrowIcon.innerHTML = rightArrow;

        player1Label.style.color = greenColor;
        player2Label.style.color = redColor;
      } else if (data['activePlayer'] == 1) {
        arrowIcon.innerHTML = leftArrow;

        player1Label.style.color = redColor;
        player2Label.style.color = greenColor;
      }
    });
}

function disableCells(activePlayer) {
  if (activePlayer == 0) {
    cells1.forEach(function(cell) {
      cell.removeEventListener('click', fakeFunction)
    })
    cells2.forEach(function(cell) {
      cell.removeEventListener('click', updateStatus)
    })
  }
  else if (activePlayer == 1) {
    cells1.forEach(function(cell) {
      cell.removeEventListener('click', updateStatus)
    })
    cells2.forEach(function(cell) {
      cell.removeEventListener('click', fakeFunction)
    })
  }
  
}

function handleShoot(row, column) {
  const url = `/handleShoot?row=${row}&column=${column}`;
  return fetch(url).then(response => response.json())
}

function disableEnableBoards(activePlayer) {
  if (activePlayer == 0) {
    cells1.forEach(transform_to_fake_function); 
    cells2.forEach(transform_to_update_status);
  }
  else if (activePlayer == 1) {
    cells1.forEach(transform_to_update_status); 
    cells2.forEach(transform_to_fake_function); 
  }
}

function transform_to_update_status(cell) {
  cell.removeEventListener('click', fakeFunction);
  cell.addEventListener('click', updateStatus);
}

function transform_to_fake_function(cell) {
  cell.removeEventListener('click', updateStatus);
  cell.addEventListener('click', fakeFunction);
}

function fakeFunction(){}

function loadGameState() {
  return fetch("/process").then(response => response.json())
}

function drawOpenedBoard1() {
  let board1 = currentData['openedBoard1'];

  for (let row = 0; row < board1.length; row++) {
    for (let col = 0; col < board1[row].length; col++) {
      let cell = cells1[row * board1[row].length + col];

      while (cell.classList.length > 0) {
        let className = cell.classList.item(0);
        cell.classList.remove(className);
      }
      if (board1[row][col] == -1) {
        cell.classList.add('missed');
      } else if (board1[row][col] == 1) {
        cell.classList.add('ship');
      } else if (board1[row][col] == 0) {
        cell.classList.add('cleared')
      }
    }
  }
}

function drawOpenedBoard2() {
  let board2 = currentData['openedBoard2'];

  for (let row = 0; row < board2.length; row++) {
    for (let col = 0; col < board2[row].length; col++) {
      let cell = cells2[row * board2[row].length + col];

      while (cell.classList.length > 0) {
        let className = cell.classList.item(0);
        cell.classList.remove(className);
      }

      if (board2[row][col] == -1) {
        cell.classList.add('missed');
      } else if (board2[row][col] == 1) {
        cell.classList.add('ship');
      } else if (board2[row][col] == 0) {
        cell.classList.add('cleared')
      }
    }
  }
}

function drawGameState(currentData) {
  let board1 = currentData['board1'];

  for (let row = 0; row < board1.length; row++) {
    for (let col = 0; col < board1[row].length; col++) {
      let cell = cells1[row * board1[row].length + col];

      if (board1[row][col] == -1) {
        cell.classList.remove();
        cell.classList.add('missed');
      } else if (board1[row][col] == 1) {
        cell.classList.remove();
        cell.classList.add('ship');
      }
    }
  }

  let board2 = currentData['board2'];

  for (let row = 0; row < board2.length; row++) {
    for (let col = 0; col < board2[row].length; col++) {
      let cell = cells2[row * board2[row].length + col];

      if (board2[row][col] == -1) {
        cell.classList.remove();
        cell.classList.add('missed');
      } else if (board2[row][col] == 1) {
        cell.classList.remove();
        cell.classList.add('ship');
      }
    }
  }
}

let newGameButton = document.getElementById("start-new-game")
newGameButton.addEventListener('click', startNewGame);

function startNewGame() {
  arrowIcon.innerHTML = ""
  regenerateButton1.addEventListener('click', regenerateBoard1)
  regenerateButton2.addEventListener('click', regenerateBoard2)

  confirmButton1.addEventListener('click', confirmFunction1)
  confirmButton2.addEventListener('click', confirmFunction2)

  return fetch("/new_game")
  .then(response => response.json())
  .then(function(data) {
    currentData['message'] = data['message']
    currentData['board1'] = data['board1'];
    currentData['board2'] = data['board2'];
    currentData['openedBoard1'] = data['openedBoard1'];
    currentData['openedBoard2'] = data['openedBoard2'];
    currentData['activePlayer'] = data['activePlayer'];
    
    messageLabel.innerHTML = "Player 2, close your eyes. Player 1, choose your ships layout and click 'Confirm' when you finished."
    drawOpenedBoard1()
    clearBoard(cells2)
  })
}