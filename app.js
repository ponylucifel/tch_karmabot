var tmi = require('tmi.js');
// keeps track of all user's karma
var dict = {};

var options = {
    options:{ 
        debug: true
    },
    connection: {
        cluster: "aws",
        reconnect: true
    },
    identity: {
        username: "TestChatBot",
        password: "oauth:x06swipi051y8xfakhihl6hgoo4we4"
    },
    channels: ["blazedspeeder"]
};

var client = new tmi.client(options);
client.connect();

client.on("chat", function (channel, userstate, message, self) {
    // Input which chatroom to use
    var chatroom = "blazedspeeder";

    // Don't listen to my own messages..
    if (self) return;

    var temp = message.toLowerCase();
    // Do your stuff.
    if(temp.indexOf("hello")!= -1|| temp.indexOf("hey")!= -1){
        client.action(chatroom, "Hello, " + userstate['display-name'] +", how are you, noob?")
    }

    if(temp.indexOf("how are you")!= -1 || temp.indexOf("how are u")!= -1){
        client.action(chatroom, "I'm fine noob.");
    }
    temp = message.substring(message.lastIndexOf("@")+1,message.lastIndexOf("++"));
    if(dict[temp]){
        dict[temp] += 1; 
        console.log(dict);
    }else{
        dict[temp] = 1;
        console.log(dict);
    }

});

client.on('connected', function(address, port){
    client.action("misterstytch", "Hey noob, wassup!");
});
