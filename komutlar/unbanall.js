const Discord = require("discord.js");

exports.run = function(client, message, args) {
  let guild = message.guild; 
  message.channel.send("**Bütün Yasaklı Üyelerin Yasağını Kaldırdım!**");
  message.guild.fetchBans().then(bans => {
    bans.forEach(ban => {
      message.guild.unban(ban.id);
    });
  });
};
module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["unbal-all", "topluaf", "toplu-af", "genel-af"],
  kategori: "MODERASYON KOMUTLARI",
  permLevel: 4
};

module.exports.help = {
  name: "unbanall",
  description: "Sunucdaki Bütün Yasakları Kaldırır!.",
  usage: "unbanall"
};