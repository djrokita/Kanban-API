$(document).ready(function() {

  function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var str = '';
    for (i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

  function setNewBoard(name) {
    var board = new Board(name);
    $('.operate').after(board.$element);
    board.$element.hide();
    board.$element.slideDown('slow');

    return board;
  }

  //Tworzenie tablicy
  //Dodane ode mnie
  var board = setNewBoard('Kanban');

  // TWORZENIE KOLUMN
  var todoColumn = new Column('To do');
  var doingColumn = new Column('Doing');
  var doneColumn = new Column('Done');

  // DODAWANIE KOLUMN DO TABLICY
  board.addColumn(todoColumn);
  board.addColumn(doingColumn);
  board.addColumn(doneColumn);

  // TWORZENIE NOWYCH EGZEMPLARZY KART
  var card1 = new Card('New task');
  var card2 = new Card('Create kanban boards');

  // DODAWANIE KART DO KOLUMN
  todoColumn.addCard(card1);
  doingColumn.addCard(card2);

  checkList();
});