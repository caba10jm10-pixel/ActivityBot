const {
    loadMessages,
    saveMessages,
    saveWinners
} = require("./save");


function resetRanking(){


    const data = loadMessages();


    const ranking = Object.entries(data)
        .sort((a,b) => b[1].messages - a[1].messages)
        .slice(0,3);



    let winners = {};



    if(ranking[0]){

        winners.first = {
            id: ranking[0][0],
            username: ranking[0][1].username,
            messages: ranking[0][1].messages,
            coins: 100
        };

    }


    if(ranking[1]){

        winners.second = {
            id: ranking[1][0],
            username: ranking[1][1].username,
            messages: ranking[1][1].messages,
            coins: 70
        };

    }


    if(ranking[2]){

        winners.third = {
            id: ranking[2][0],
            username: ranking[2][1].username,
            messages: ranking[2][1].messages,
            coins: 50
        };

    }



    saveWinners(winners);


    saveMessages({});


}


module.exports = resetRanking;