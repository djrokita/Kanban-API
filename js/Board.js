$(document).ready(function() {

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

});