var tmi = require('tmi.js');

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
    channels: ["misterstytch"]
};

var client = new tmi.client(options);
client.connect();

client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;
    var temp = message.toLowerCase();
    // Do your stuff.
    if(temp.indexOf("hello")!= -1|| temp.indexOf("hey")!= -1){
        client.action("misterstytch", "Hello, " + userstate['display-name'] +", how are you, noob?")
    }

    if(temp.indexOf("how are you")!= -1 || temp.indexOf("how are u")!= -1){
        client.action("misterstytch", "I'm fine noob.");
    }
});

client.on('connected', function(address, port){
    client.action("misterstytch", "Hey noob, wassup!");
});
