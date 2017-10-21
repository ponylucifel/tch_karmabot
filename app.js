var tmi = require('tmi.js');

// keeps track of all user's karma
var dict = {};
var botPassword = "oauth:vi0vhkpbl7x0frm3dxnpuzgwp88hxi";
var rankLimit = 3;
var karmaUser = "";

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

    var botCmd = message.toLowerCase();

    // Feature: show my karma points
    if(botCmd == "!karma me"){
        var karmaUser = userstate['display-name'];
        if(dict[karmaUser]){
            console.log("Invoking !karma me for "+ karmaUser);
            client.action(chatroom, karmaUser +` has ${dict[karmaUser]} karma points.`); 
            return;
        }else{
            client.action(chatroom, karmaUser +` has no karma points.`);
            return; 
        }
    }

    // Feature: show the top people who have the most karma points
    if(botCmd == "!karma") {
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
    // Feature: detect non karma bot commands
    if (karmaUser.length == 0) {
        console.log(`${message} - not a karma message`);
        return;
    }
    if (karmaUser != "@") {
        if (karmaUser == userstate["display-name"]) {
            console.log(`${karmaUser} attempting to give karma to himself`);
            client.action(chatroom, "Don't be a smartass.")
            return;
        }
        
        // Feature: add karma to other users , announce when user acquired a point or meet some points treshold
        if(dict[karmaUser]){
            dict[karmaUser] += 1; 
            console.log(dict);
            if (dict[karmaUser] != 0 && dict[karmaUser]%5 === 0){
                client.action(chatroom, karmaUser +" has accumulated "+ dict[karmaUser] +" karma points, Great job!");
                return; 
            }else{
                client.action(chatroom, karmaUser +` now has ${dict[karmaUser]} karma point.`); 
                return;
            }
        } else {
            dict[karmaUser] = 1;
            client.action(chatroom, karmaUser +" has his/her first karma point!"); 
            console.log(dict);
            return;
        }
    }

    // Feature: deduct karma to other users , announce when user acquired a point or meet some points treshold
    karmaUser = message.substring(message.lastIndexOf("@")+1,message.indexOf("-"));
    if (karmaUser != "@") {
        if (karmaUser == userstate["display-name"]) {
            console.log(`${karmaUser} attempting to deduct his karma`);
            client.action(chatroom, "Don't try reducing your own karma.")
            return;
        }
        if(dict[karmaUser]){
            dict[karmaUser] -= 1; 
            console.log(dict);
            client.action(chatroom, karmaUser +` now has ${dict[karmaUser]} karma point.`); 
            return;
        }else{
            dict[karmaUser] = -1;
            client.action(chatroom, karmaUser +` now has ${dict[karmaUser]} karma point.`); 
            return;
        }   
    }

    console.log("User failed to increment / decrement karma.")
    client.action(chatroom, `Sorry don't know what you're trying to do.`);
});
