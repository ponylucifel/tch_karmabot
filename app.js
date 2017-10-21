var tmi = require('tmi.js');
// keeps track of all user's karma
var dict = {};
var botPassword = "oauth:vi0vhkpbl7x0frm3dxnpuzgwp88hxi";
var options = {
    options:{ 
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "KarmaBot",
        password: botPassword
    },
    channels: ["blazedspeeder", "misterstytch", "du_tum_mai"]
};
var chatroom = "du_tum_mai";

var client = new tmi.client(options);
client.connect();

client.on("chat", function (channel, userstate, message, self) {
    // Input which chatroom to use

    // Don't listen to my own messages..
    if (self) return;

    var karmaUser = message.substring(message.lastIndexOf("@")+1,message.lastIndexOf("++"));
    console.log(karmaUser);
    if(dict[karmaUser]){
        dict[karmaUser] += 1;
        console.log(dict);
        if (dict[karmaUser]%5 === 0){
            client.action(chatroom, karmaUser +" accumulated "+ dict[karmaUser] +" karma points, Great job!"); 
        }else{
            client.action(chatroom, karmaUser +" has been given 1 karma point."); 
        }
    }else{
        dict[karmaUser] = 1;
        console.log(dict);
    }

});
