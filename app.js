var tmi = require('tmi.js');
<<<<<<< Updated upstream
// keeps track of all user's karma
var dict = {};
=======
var map = {}
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
client.connect();
client.on("chat", function (channel, userstate, message, self) {
    // Input which chatroom to use
    var chatroom = "blazedspeeder";

=======
var chatroom = "blazedspeeder";
var request = require("request");
var cheerio = require("cheerio");

client.on("chat", function (channel, userstate, message, self) {
    // Input which chatroom to use
    var ChatURL = "https://tmi.twitch.tv/group/user/"+chatroom+"/chatters";   
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
    temp = message.substring(message.lastIndexOf("@")+1,message.lastIndexOf("++"));
    if(dict[temp]){
        dict[temp] += 1; 
        console.log(dict);
    }else{
        dict[temp] = 1;
        console.log(dict);
    }

=======
    request({
        uri: ChatURL,
        }, function(error, response, body) {
        var $ = cheerio.load(body);

        $(".entry-title > a").each(function() {
        var link = $(this);
        var text = link.text();
        var href = link.attr("href");

        console.log(text + " -> " + href);
        });
    });
        
>>>>>>> Stashed changes
});

client.on('connected', function(address, port){
    client.action(chatroom,"Hey noob, wassup!");
});
