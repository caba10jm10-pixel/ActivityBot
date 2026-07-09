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

    let winnerText = "No one participated today.";
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
    const top3 = ranking.slice(0, 3);

    const rewards = [100, 70, 50];
    const medals = ["🥇", "🥈", "🥉"];

    let description = "No one participated today.";

    if (top3.length > 0) {
        description = top3
            .map(([userId, userData], index) =>
                `${medals[index]} <@${userId}>: 💰 **${rewards[index]} Coins** (${userData.messages} messages)`
            )
            .join("\n");
    }

    const embed = new EmbedBuilder()
        .setTitle("📅 End of the Day")
        .setDescription(`🏆 **Today's Top Chatters**\n\n${description}`)
        .setColor(0xFFD700)
        .setFooter({ text: "Keep chatting to earn more coins!" })
        .setTimestamp();

    await channel.send({ embeds: [embed] });
}

    // 🗑️ Vaciar messages.json
    saveMessages({});

    // ▶️ El nuevo día empieza solo, ya que messages.json quedó vacío
}

module.exports = resetRanking;