/** @jsx React.DOM */
var React = require('react');
var ReactMeteor = require('react-meteor');
var classSet = require('react-classset');

var Players = new Meteor.Collection("players");

Meteor.startup(function() {
  var App = ReactMeteor.createMeteorClass({
    getMeteorState: function() {
      var player = Players.findOne(Session.get("selected_player"));

      return {
        selectedName: player && player.name
      };
    },

    handleClick: function() {
      Players.update(Session.get("selected_player"), {$inc: {score: 5}});
    },

    render: function() {
      var details = null;

      if (this.state.meteor.selectedName) {
        details = (
          <div className="details">
            <div className="name">{this.state.meteor.selectedName}</div>
            <input
              type="button"
              className="inc"
              value="Give 5 points"
              onClick={this.handleClick}
            />
          </div>
        );
      } else {
        details = <div className="none">Click a player to select</div>;
      }

      return (
        <div id="outer">
          <Leaderboard />
          {details}
        </div>
      );
    }
  });

  var Leaderboard = ReactMeteor.createMeteorClass({
    getMeteorState: function() {
      return {
        players: Players.find({}, {sort: {score: -1, name: 1}}).fetch()
      };
    },

    render: function() {
      var players = this.state.meteor.players.map(function(player) {
        return <Player player={player} key={player._id} />;
      });
      return (
        <div className="leaderboard">
          {players}
        </div>
      );
    }
  });

  var Player = ReactMeteor.createMeteorClass({
    getMeteorState: function() {
      return {
        selected: Session.equals("selected_player", this.props.player._id)
      };
    },

    handleClick: function() {
      Session.set("selected_player", this.props.player._id);
    },

    render: function() {
      return (
        <div
          className={classSet({player: true, selected: this.state.meteor.selected})}
          onClick={this.handleClick}>
          <span className="name">{this.props.player.name}</span>
          <span className="score">{this.props.player.score}</span>
        </div>
      );
    }
  });

  if (Meteor.isClient) {
    React.renderComponent(<App />, document.body);
  }
});

// On server startup, create some players if the database is empty.
if (Meteor.isServer) {
  Meteor.startup(function () {
    if (Players.find().count() === 0) {
      var names = ["Ada Lovelace",
                   "Grace Hopper",
                   "Marie Curie",
                   "Carl Friedrich Gauss",
                   "Nikola Tesla",
                   "Claude Shannon"];
      for (var i = 0; i < names.length; i++)
        Players.insert({name: names[i], score: Math.floor(Random.fraction()*10)*5});
    }
  });
}
