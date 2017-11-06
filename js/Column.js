$(document).ready(function() {
  
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
        $.ajax({
          url: baseUrl + '/card',
          method: 'post';
          data: {
            name: newCard,
            bootcamp_kanban_column_id: self.id
          },
          success: function(response) {
            var card = new Card(response.id, newCard);
            self.addCard(card);
          }
        });
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
});