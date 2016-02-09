var cloak = require('cloak');
var _ = require('underscore');

cloak.configure({
  port: 8090,
  roomLife: 1000*60*60*3,

  autoJoinLobby: false,
  minRoomMembers: 1,
  pruneEmptyRooms: 1000,
  reconnectWait: 3000,

  messages: {
    registerUsername: function(arg, user) {
      var users = cloak.getUsers();
      var username = arg.username;
      console.log(username);
      var usernames = _.pluck(users, 'username');
      var success = false;
      if (_.indexOf(usernames, username) === -1) {
        success = true;
        user.name = username;
        console.log('creating user');
      }
      user.message('registerUsernameResponse', success);
    },

    joinLobby: function(arg, user) {
      var success = cloak.getLobby().addMember(user);
      user.message('joinLobbyResponse', success);
    },

    listUsers: function(arg, user){
    	user.message('refreshLobby', {
        users: user.room.getMembers(true),
        inLobby: user.room.isLobby,
        roomCount: user.room.getMembers().length,
        roomSize: user.room.size
      });
    },

    listRooms: function(arg, user){
      user.message('refreshRooms', cloak.getRooms(true));
    }
  }
});

cloak.run();
