const { EmbedBuilder } = require("discord.js");
const config = require("../config.json");
const {
    loadMessages,
    saveMessages,
    loadSettings,
    saveSettings,
    loadWinners,
    saveWinners
} = require("./save");

async function resetRanking(client) {

    const data = loadMessages();
    const settings = loadSettings();

    const ranking = Object.entries(data)
        .sort((a, b) => b[1].messages - a[1].messages);

    const winnerEntry = ranking[0];

    let winnerText = "Nadie participó hoy.";
    let winnerId = null;
    let winnerMessages = 0;

    if (winnerEntry) {
        winnerId = winnerEntry[0];
        winnerMessages = winnerEntry[1].messages;
        winnerText = `<@${winnerId}>`;

        // 🥇 Guardar el ganador del día
        const winners = loadWinners();
        const today = new Date().toISOString().split("T")[0];

        winners[today] = {
            userId: winnerId,
            username: winnerEntry[1].username,
            messages: winnerMessages
        };

        saveWinners(winners);
    }

    // 👤 Actualizar lastWinner
    settings.lastWinner = winnerText;
    saveSettings(settings);

    // 📢 Enviar mensaje al canal anunciando el ganador
    const channel = client.channels.cache.get(config.channelId);

    if (channel) {
        const embed = new EmbedBuilder()
            .setTitle("🏆 Resultado del día")
            .setDescription(
                winnerId
                    ? `¡Felicidades ${winnerText}!\nGanaste con **${winnerMessages} mensajes**.`
                    : winnerText
            )
            .setColor(0xffd700)
            .setTimestamp();

        await channel.send({ embeds: [embed] });
    }

    // 🗑️ Vaciar messages.json
    saveMessages({});

    // ▶️ El nuevo día empieza solo, ya que messages.json quedó vacío
}

module.exports = resetRanking;