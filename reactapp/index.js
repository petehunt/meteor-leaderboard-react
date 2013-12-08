/** @jsx React.DOM */
var React = require('react');
var ReactMeteor = require('react-meteor');
var classSet = require('react-classset');

var Players = new Meteor.Collection("players");

Meteor.startup(function() {
  var App = ReactMeteor.createMeteorClass({
    getInitialState: function() {
      return {
        selectedPlayerID: null
      };
    },

    getMeteorState: function() {
      var player = Players.findOne(this.state.selectedPlayerID);

      return {
        selectedName: player && player.name
      };
    },

    handleSelectPlayer: function(id) {
      this.setState({selectedPlayerID: id});
    },

    handleClick: function() {
      Players.update(this.state.selectedPlayerID, {$inc: {score: 5}});
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
          <Leaderboard
            selectedPlayerID={this.state.selectedPlayerID}
            onSelectPlayer={this.handleSelectPlayer}
          />
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
        return (
          <Player
            player={player}
            key={player._id}
            selectedPlayerID={this.props.selectedPlayerID}
            onSelect={this.props.onSelectPlayer.bind(null, player._id)}
          />
        );
      }, this);
      return (
        <div className="leaderboard">
          {players}
        </div>
      );
    }
  });

  var Player = React.createClass({
    render: function() {
      return (
        <div
          className={classSet({player: true, selected: this.props.selectedPlayerID === this.props.player._id})}
          onClick={this.props.onSelect}>
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
