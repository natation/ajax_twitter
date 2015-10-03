(function ($) {
  $.FollowToggle = function (el, options) {
    this.$el = $(el);
    this.userId = this.$el.data("user-id") || options.userId;
    this.followState = this.$el.data("initial-follow-state") || options.followState;
    this.inMiddleOfHandling = false;
    this.render();
    this.bindEvents();
  };

  $.fn.followToggle = function (options) {
    return this.each(function () {
      new $.FollowToggle(this, options);
    });
  };

  $.FollowToggle.prototype.bindEvents = function () {
    this.$el.on("click", this.handleClick.bind(this));
  };

  $.FollowToggle.prototype.render = function () {
    var inflect = "";
    if (this.inMiddleOfHandling) {
      inflect = "ing";
    }
    var buttonText = '';
    if (this.followState) {
      buttonText = "Unfollow" + inflect + "!";
    } else {
      buttonText = "Follow" + inflect + "!";
    }
    this.$el.text(buttonText);
  };

  $.FollowToggle.prototype.toggleFollowing = function () {
    this.followState = !this.followState;
  };

  $.FollowToggle.prototype.enable = function () {
    this.inMiddleOfHandling = false;
    this.$el.prop("disabled", false);
  };

  $.FollowToggle.prototype.handleClick = function (e) {
    e.preventDefault();
    var typeField;
    if (this.inMiddleOfHandling) { return; }

    this.inMiddleOfHandling = true;
    this.$el.prop("disabled", true);
    this.render();

    typeField = this.followState ? 'DELETE' : 'POST';

    var that = this;
    $.ajax({
      url: '/users/' + that.userId + '/follow',
      type: typeField,
      dataType: 'json',
      success: function( resp ) {
        that.toggleFollowing();
        that.enable();
        that.render();
      },
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
        that.enable();
        that.render();
      }
    });
  };

  $(function () {
    $("button.follow-toggle").followToggle();
  });
})(jQuery);
