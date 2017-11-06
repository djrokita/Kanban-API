$(document).ready(function() {
  
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
});