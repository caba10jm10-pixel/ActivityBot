const fs = require("fs");


function loadMessages(){

    return JSON.parse(
        fs.readFileSync("./data/messages.json")
    );

}


function saveMessages(data){

    fs.writeFileSync(
        "./data/messages.json",
        JSON.stringify(data,null,4)
    );

}


function loadSettings(){

    return JSON.parse(
        fs.readFileSync("./data/settings.json")
    );

}


function saveSettings(data){

    fs.writeFileSync(
        "./data/settings.json",
        JSON.stringify(data,null,4)
    );

}


// Ganadores del día

function loadWinners(){

    if(!fs.existsSync("./data/winners.json")){

        fs.writeFileSync(
            "./data/winners.json",
            "{}"
        );

    }


    return JSON.parse(
        fs.readFileSync("./data/winners.json")
    );

}



function saveWinners(data){

    fs.writeFileSync(
        "./data/winners.json",
        JSON.stringify(data,null,4)
    );

}



module.exports = {
    loadMessages,
    saveMessages,
    loadSettings,
    saveSettings,
    loadWinners,
    saveWinners
};