$(document).ready(function() {

  var url = 'https://kodilla.com/pl/bootcamp-api';
  var prefix = 'https://cors-anywhere.herokuapp.com/';
  var baseUrl = prefix + url;

  var myHeader = {
    'X-Client-Id': '2341',
    'X-Auth-Token': 'b7da6395d9aac5dd5bcdadeef0e0cc85'
  };

  //Klasy

  function Board(name, num) {
    var self = this;
    this.name = name;
    this.$element = createBoard();

    function createBoard() {
      var $board = $('<div>').addClass('board');
      var $container = $('<div>').addClass('column-container');
      var $boardTitle = $('<h1>').text(self.name);
      var $setColumn = $('<button>').addClass('create-column').text('new column');

      $setColumn.click(newColumn);

      $board.append($boardTitle);
      $board.append($setColumn);
      $board.append($container);

      return $board;
    }
  }

  function Column(id, name) {
    var self = this;
    this.id = id;
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

      $columnTitle.click(function() {
        self.changeColumnName();
      });

      $columnDelete.click(function() {
        self.removeColumn();
      });

      $columnAddCard.click(function() {
        self.newCard();
      });

      $column.append($columnTitle);
      $column.append($columnDelete);
      $column.append($columnAddCard);
      $column.append($columnCardList);
      $fakeCard.text('Put card here'); // Tekst do dodatkowej karty
      $columnCardList.append($fakeCard);

      $column.data('id', self.id);

      return $column;
    }
  }

  function Card(id, name, colId) {
    var self = this;
    this.id = id;
    this.name = name;
    this.bootcamp_kanban_column_id = colId;
    this.$element = createCard();

    function createCard() {
      var $card = $('<li>').addClass('card');
      var $cardDescription = $('<p>').addClass('card-description').text(self.name);
      var $cardDelete = $('<button>').addClass('btn-delete').text('x');

      $cardDelete.click(function() {
        self.removeCard();
        checkList();
      });

      $cardDescription.dblclick(function() {
        self.changeCardName();
      });

      $card.append($cardDelete);
      $card.append($cardDescription);

      $card.data('id', self.id);
      $card.data('name', self.name);

      return $card;
    }
  }

  //Protosy - Board

  Board.prototype.addColumn = function(column) {
    this.$element.find('.column-container').append(column.$element);
    column.$element.hide();
    column.$element.fadeIn(1500);
    initSortable();
  };

  //Protosy - Column

  Column.prototype.newCard = function() {
    var self = this;
    var newCard = setName();
    if (newCard != null) {
      $.ajax({
        url: baseUrl + '/card',
        method: 'POST',
        data: {
          name: newCard,
          bootcamp_kanban_column_id: self.id
        },
        headers: myHeader,
        success: function(response) {
          var card = new Card(response.id, newCard);
          self.addCard(card);
        }
      });
    }
  };

  Column.prototype.addCard = function(card) {
    this.$element.find('.column-card-list').prepend(card.$element); //Małe udoskonalenie - zamiana z 'append' na 'prepand';)    
    checkList();
  };

  Column.prototype.removeColumn = function() {
    var self = this;
    $.ajax({
      url: baseUrl + '/column/' + self.id,
      method: 'DELETE',
      headers: myHeader,
      success: function() {
        self.$element.remove();
      }
    });
  };

  Column.prototype.changeColumnName = function() {
    var self = this;
    var newName = setName();
    if (newName != null) {
      $.ajax({
        url: baseUrl + '/column/' + self.id,
        method: 'PUT',
        headers: myHeader,
        data: {
          name: newName
        },
        success: function() {
          self.$element.find('h2').text(newName);
        }
      });
    }
  };

  // Protosy - Card

  Card.prototype = {
    removeCard: function() {
      var self = this;
      $.ajax({
        url: baseUrl + '/card/' + self.id,
        method: 'DELETE',
        headers: myHeader,
        success: function() {
          self.$element.remove();
        }
      });
    },
    changeCardName: function() {
      var self = this;
      var newName = setName();
      if (newName != null) {
        $.ajax({
          url: baseUrl + '/card/' + self.id,
          method: 'PUT',
          headers: myHeader,
          data: {
            name: newName,
            bootcamp_kanban_column_id: self.bootcamp_kanban_column_id
          },
          success: function() {
            self.$element.find('p').text(newName);
          }
        });
      }
    }
  };

  //Funkcje do tworzenia elementów Kanban

  function newColumn() {
    var columnName = setName();
    setNewColumn(columnName);
  }

  function setName() {
    var temp = prompt('Enter a name', 'New Element');
    if (temp == '') temp = 'No name given';
    return temp;
  }

  function setNewColumn(name) {
    if (name != null) {
      $.ajax({
        url: baseUrl + '/column',
        method: 'POST',
        headers: myHeader,
        data: {
          name: name
        },
        success: function(response) {
          var column = new Column(response.id, name);
          column.$element.appendTo($('.create-column').focus().siblings('.column-container'));
          column.$element.hide();
          column.$element.fadeIn('slow');
          initSortable();
        }
      });
    }
  }

  //Funkcje sortujące karty

  function initSortable() {
    $('.column-card-list').sortable({
      update: function(mouseleave, karta) {
        var columnId = $(this).parents('.column').data('id');
        var movedCard = karta.item;
        console.log('ID karty: ', movedCard.data('id'));

        $.ajax({
          url: baseUrl + '/card/' + movedCard.data('id'),
          method: 'PUT',
          headers: myHeader,
          data: {
            name: movedCard.data('name'),
            bootcamp_kanban_column_id: columnId
          },
          success: function() {
            console.log('Przeniesiono');
            checkList();
          }
        });
      },
      connectWith: '.column-card-list',
      placeholder: 'card-placeholder'
    }).disableSelection();
  }

  function checkList() {
    $('.column-card-list').each(function() {
      if ($(this).find('li').length > 1) $(this).find('.fake').hide();
      else $(this).find('.fake').show();
    });
  }

  $.ajax({
    url: baseUrl + '/board',
    method: 'GET',
    headers: myHeader,
    success: function(response) {
      setBoard(response);
    }
  });

  //Tworzenie obiektów

  function setBoard(name) {
    var board = new Board(name.name);
    $('.container').append(board.$element);
    name.columns.forEach(function(item) {
      var col = new Column(item.id, item.name);
      board.addColumn(col);
      setupCard(col, item.cards);
    });
    board.$element.hide();
    board.$element.slideDown('slow');
    return board;
  }

  function setupColumn(id, columns) {
    columns.forEach(function(item) {
      var col = new item(item.id, item.name);
      board.addColumn(col);
      setupCard(col, item.cards);
    });
  }

  function setupCard(col, cards) {
    cards.forEach(function(item) {
      var card = new Card(item.id, item.name, item.bootcamp_kanban_column_id);
      col.addCard(card);
    });
  }

  checkList();
});