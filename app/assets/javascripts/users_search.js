(function ($) {
  $.UsersSearch = function (el) {
    this.$el = $(el);
    this.$ul = this.$el.find(".users");
    this.$input = this.$el.find("input");
    this.bindEvents();
  };

  $.fn.usersSearch = function () {
    return this.each(function () {
      new $.UsersSearch(this);
    });
  };

  $.UsersSearch.prototype.bindEvents = function () {
    this.$input.on("input", this.handleInput.bind(this));
  };

  $.UsersSearch.prototype.handleInput = function () {
    var that = this;
    $.ajax({
      type: 'GET',
      url: '/users/search',
      data: {'query': that.$input.val()}, // since it's a get request, jquery adds data to the query string.
      dataType: 'json',
      success: function( resp ) {
        that.renderResults(resp);
      },
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });
  };

  $.UsersSearch.prototype.renderResults = function(resp) {
    this.$ul.empty();
    for (var i = 0; i < resp.length; i++) {
      var $li = $("<li>"),
          $a = $("<a>"),
          $button = $("<button>"),
          user;
      user = resp[i];
      $a.attr("href", "/users/" + user.id);
      $a.text(user.username);
      $li.append($a);
      $li.append($button.followToggle({userId: user.id, followState: user.followed}));
      this.$ul.append($li);
    }
  };

  $(function() {
    $("div.users-search").usersSearch();
  });
})(jQuery);
