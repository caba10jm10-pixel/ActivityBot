require("dotenv").config();

const {
    Client,
    GatewayIntentBits
} = require("discord.js");

const config = require("./config.json");

const {
    loadMessages,
    saveMessages,
    loadSettings,
    saveSettings
} = require("./utils/save");

const leaderboard = require("./utils/leaderboard");
const resetRanking = require("./utils/reset");


const client = new Client({

    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]

});



client.once("ready", async () => {

    console.log(
        "Bot conectado: " + client.user.tag
    );


    const channel = client.channels.cache.get(
        config.channelId
    );


    if (!channel) {
        console.log("No se encontró el canal de leaderboard");
        return;
    }


    let settings = loadSettings();

    let msg;


    if (settings.messageId) {

        try {

            msg = await channel.messages.fetch(
                settings.messageId
            );

        } catch {

            msg = null;

        }

    }


    if (!msg) {

        msg = await channel.send({

            embeds: [
                leaderboard()
            ]

        });


        settings.messageId = msg.id;

        saveSettings(settings);

    }



    // Actualizar leaderboard cada minuto

    setInterval(async () => {

        try {

            await msg.edit({

                embeds: [
                    leaderboard()
                ]

            });

            console.log("Leaderboard actualizada");

        } catch (error) {

            console.log(
                "Error actualizando leaderboard:",
                error.message
            );

        }


    }, 60000);


});





// Contar mensajes

client.on("messageCreate", message => {


    if (message.author.bot)
        return;



    let data = loadMessages();



    if (!data[message.author.id]) {

        data[message.author.id] = {

            username: message.author.username,

            messages: 0

        };

    }



    data[message.author.id].username =
        message.author.username;



    data[message.author.id].messages++;



    saveMessages(data);



});





// Reinicio diario

setInterval(async () => {


    const date = new Date();



    if (
        date.getHours() === config.resetHour &&
        date.getMinutes() === 0
    ) {


        await resetRanking();


        console.log("Ranking reiniciado");


    }


}, 60000);





client.login(
    process.env.TOKEN
);