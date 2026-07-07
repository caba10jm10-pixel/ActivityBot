const { EmbedBuilder } = require("discord.js");
const { loadMessages, loadSettings } = require("./save");


function createLeaderboard(){

    const data = loadMessages();
    const settings = loadSettings();


    const ranking = Object.entries(data)
        .sort((a,b)=>b[1].messages-a[1].messages)
        .slice(0,10);


    let text = "";


    if(ranking.length === 0){

        text = "There is no activity today.";

    } else {


        ranking.forEach(([id,user],index)=>{


            let medal = `${index + 1}.`;

            if(index === 0) medal = "🥇";
            if(index === 1) medal = "🥈";
            if(index === 2) medal = "🥉";


            text += `${medal} <@${id}>: **${user.messages} messages**\n`;


        });

    }



    return new EmbedBuilder()

    .setTitle("📊 Daily Activity Ranking")

    .setDescription(
`${text}


👤 **Yesterday's Winner**
${settings.lastWinner}


⏳ **Time Remaining**
Until the next reset at 16:00


🔄 Updates every minute`
    )

    .setColor(0xffd700)

    .setTimestamp();

}


module.exports = createLeaderboard;