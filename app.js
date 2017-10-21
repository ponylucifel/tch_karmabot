var tmi = require('tmi.js');

// keeps track of all user's karma
var dict = {};
var botPassword = "oauth:vi0vhkpbl7x0frm3dxnpuzgwp88hxi";
var rankLimit = 3;
var karmaUser = "";
const myRegexpPlus = /^.*@([A-Za-z0-9_]*)(?:\+)+.*$/gm;
const myRegexpMinus = /^.*@([A-Za-z0-9_]*)(?:\-)+.*$/gm; 
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

    karmaUser = myRegexpPlus.exec(message);

    // Feature: detect non karma bot commands
    if(karmaUser){
        if (karmaUser[1].length == 0) {
            console.log(`${message} - not a karma message`);
            myRegexpPlus.lastIndex = 0;
            return;
        }
        if (karmaUser[1] != "@") {
            if (karmaUser[1] == userstate["display-name"]) {
                console.log(`${karmaUser[1]} attempting to give karma to himself`);
                client.action(chatroom, "Don't be a smartass.");
                myRegexpPlus.lastIndex = 0;
                return;
            }
            
            // Feature: add karma to other users , announce when user acquired a point or meet some points treshold
            if(dict[karmaUser[1]]){
                dict[karmaUser[1]] += 1; 
                console.log(dict);
                if (dict[karmaUser[1]] != 0 && dict[karmaUser[1]]%5 === 0){
                    client.action(chatroom, karmaUser[1] +" has accumulated "+ dict[karmaUser[1]] +" karma points, Great job!");
                    myRegexpPlus.lastIndex = 0;
                    return; 
                }else{
                    client.action(chatroom, karmaUser[1] +` now has ${dict[karmaUser[1]]} karma point.`); 
                    myRegexpPlus.lastIndex = 0;
                    return;
                }
            } else {
                dict[karmaUser[1]] = 1;
                client.action(chatroom, karmaUser[1] +" has his/her first karma point!"); 
                console.log(dict);
                myRegexpPlus.lastIndex = 0;
                return;
            }
        }
    }

    // Feature: deduct karma to other users , announce when user acquired a point or meet some points treshold
    karmaUser = myRegexpMinus.exec(message);
    if(karmaUser){
        if (karmaUser[1] != "@") {
            if (karmaUser[1] == userstate["display-name"]) {
                console.log(`${karmaUser[1]} attempting to deduct his karma`);
                client.action(chatroom, "Don't try reducing your own karma.");
                myRegexpMinus.lastIndex = 0;
                console.log(dict);
                return;
            }
            if(dict[karmaUser[1]]){
                dict[karmaUser[1]] -= 1; 
                console.log(dict);
                client.action(chatroom, karmaUser[1] +` now has ${dict[karmaUser[1]]} karma point.`); 
                myRegexpMinus.lastIndex = 0;
                console.log(dict);
                return;
            }else{
                dict[karmaUser[1]] = -1;
                client.action(chatroom, karmaUser[1] +` now has ${dict[karmaUser[1]]} karma point.`); 
                myRegexpMinus.lastIndex = 0;
                console.log(dict);
                return;
            }   
        }
    
    }
    console.log("User failed to increment / decrement karma.")
    //client.action(chatroom, `Sorry don't know what you're trying to do.`);
});
