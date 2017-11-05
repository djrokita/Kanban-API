$(document).ready(function() {

/*  function randomString() {
    var chars = '0123456789abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXTZ';
    var str = '';
    for (i = 0; i < 10; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  } 
*/
  
  function Column(name) {
    var self = this;
  //  this.id = randomString();
    this.name = name;
    this.$element = createColumn();

    function createColumn() {
      var $column = $('<div>').addClass('column');
      var $columnTitle = $('<h2>').addClass('column-title').text(self.name);
      var $columnCardList = $('<ul>').addClass('column-card-list');
      var $fakeCard = $('<li>').addClass('fake'); // Moja wrzutka, umożliwia przenoszenie kart między kolumnami
      var $columnDelete = $('<button>').addClass('btn-delete').text('x');
      var $columnAddCard = $('<button>').addClass('add-card').text('new card');
      self.checkList = $('li').length;

      $columnDelete.click(function() {
        self.removeColumn();
      });
      $columnAddCard.click(function() {
        var newCard = prompt('Enter the name of the card', 'New Card');
        if (newCard == '') newCard = 'Action we need to do';
        if (newCard != null) self.addCard(new Card(newCard));
      });

      $column.append($columnTitle);
      $column.append($columnDelete);
      $column.append($columnAddCard);
      $column.append($columnCardList);
      $fakeCard.text('Put card here'); // Tekst do dodatkowej karty
      $columnCardList.append($fakeCard);

      return $column;
    }
  }

  Column.prototype.addCard = function(card) {
    this.$element.children('ul').prepend(card.$element); //Małe udoskonalenie - zamiana z 'append' na 'prepand';)
    checkList();
  };

  Column.prototype.removeColumn = function() {
    this.$element.remove();
  };

  function Card(description) {
    var self = this;
    //this.id = randomString();
    this.description = description;
    this.$element = createCard();

    function createCard() {
      var $card = $('<li>').addClass('card');
      var $cardDescription = $('<p>').addClass('card-description').text(self.description);
      var $cardDelete = $('<button>').addClass('btn-delete').text('x');

      $cardDelete.click(function() {
        self.removeCard();
        checkList();
      });

      $card.append($cardDelete);
      $card.append($cardDescription);

      $card.mouseleave(function() {
        checkList();
      });

      $card.mouseup(function() {
        checkList();
      });

      return $card;
    }
  }

  Card.prototype = {
    removeCard: function() {
      this.$element.remove();
    }
  };

  function initSortable() {
    $('.column-card-list').sortable({
      connectWith: '.column-card-list',
      placeholder: 'card-placeholder'
    }).disableSelection();
  }

  //Dodane ode mnie

  function Board(name, num) {
    var self = this;
  //  this.id = randomString();
    this.name = name;
    this.$element = createBoard();

    function createBoard() {
      var $board = $('<div>').addClass('board');
      var $container = $('<div>').addClass('column-container');
      var $boardTitle = $('<h1>').text(self.name);
      var $setColumn = $('<button>').addClass('create-column').text('new column');
      var $boardDelete = $('<button>').addClass('btn-delete').text('x');

      $boardDelete.click(function() {
        self.deleteBoard();
      });

      $setColumn.click(newColumn);

      $board.append($boardTitle);
      $board.append($setColumn);
      $board.append($boardDelete);
      $boardDelete.hide();
      $boardDelete.show('slow'); //Sposób na "skakanie" buttona X
      $board.append($container);

      return $board;
    }
  }

  Board.prototype.deleteBoard = function() {
    var deleteDecision = confirm('Are you sure?');
    if (deleteDecision) this.$element.remove();
  };

  Board.prototype.addColumn = function (column) {
    this.$element.find('.column-container').append(column.$element);
    column.$element.hide();
    column.$element.fadeIn(1500);
    initSortable();
  };


  function newColumn(name) {
    var columnName = prompt('Enter a column name', 'New Column');
    if (columnName == '') columnName = 'New Column';
    if (columnName != null) {
      var column = new Column(columnName);
      column.$element.appendTo($(this).siblings('.column-container'));
      column.$element.hide();
      column.$element.fadeIn('slow');
      initSortable();
    }
  }

  function setNewBoard(name) {
    var board = new Board(name);
    $('.operate').after(board.$element);
    board.$element.hide();
    board.$element.slideDown('slow');

    return board;
  }

  function checkList() {
    $('.column-card-list').each(function() {
      if ($(this).find('li').length > 1) $(this).find('.fake').hide();
      else $(this).find('.fake').show();
    });
  }

  $('.create-board').click(function() {
    var boardName = prompt('Enter a board name', 'New Kanban Board');
    if (boardName == '') boardName = 'New Kanban Board';
    if (boardName != null) setNewBoard(boardName);
  });

    //Tworzenie tablicy
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