var tmi = require('tmi.js');

// keeps track of all user's karma
var dict = {};
var botPassword = "oauth:vi0vhkpbl7x0frm3dxnpuzgwp88hxi";
var rankLimit = 3;

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
    channels: ["misterstytch"]
};

var chatroom = "misterstytch";
// var chatroom = "tch_karmabot"

var client = new tmi.client(options);
client.connect();

client.on("chat", function (channel, userstate, message, self) {
    // Input which chatroom to use

    // Don't listen to my own messages..
    if (self) return;

    var temp = message.toLowerCase();

    if(temp.indexOf("!karmabot") != -1) {
        var items = Object.keys(dict).map(function(key) {
            return [key, dict[key]];
        }); 
        
        items.sort(function(first, second) {
            return second[1] - first[1];
        });

        console.log(items);

        if (rankLimit > items.length) {
            rankLimit = items.length;
        } else {
            rankLimit = 3;
        }
        var s = ``;
        for (var i = 0; i < rankLimit; i++) {
            s += `${items[i][0]} ${items[i][1]} points. `;
        }
        client.action(chatroom, s);
        return;
    }

    karmaUser = message.substring(message.lastIndexOf("@")+1,message.indexOf("+"));
    if (karmaUser.length == 0) {
        console.log(`${message} - not a karma message`);
        return;
    }
    
    if(dict[karmaUser]){
        dict[karmaUser] += 1; 
        console.log(dict);
        if (dict[karmaUser]%5 === 0){
            client.action(chatroom, karmaUser +" has accumulated "+ dict[karmaUser] +" karma points, Great job!"); 
        }else{
            client.action(chatroom, karmaUser +` now has ${dict[karmaUser]} karma point.`); 
        }
    } else {
        dict[karmaUser] = 1;
        client.action(chatroom, karmaUser +" has his/her first karma point!"); 
        console.log(dict);
    }
});
