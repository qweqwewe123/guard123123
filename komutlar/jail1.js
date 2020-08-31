const Discord = require("discord.js");

exports.run = async (client, message, args) => {
 if (!message.member.roles.has("734196610321350657")) return message.reply('Bu komutu kullanabilmek için <@&734196610321350657> rolüne sahip olmalısın.');
let member = message.mentions.members.first();
let sebep1  = args.slice(1).join("  ");
member.removeRole("734196622912651397")
const embed = new Discord.RichEmbed()
.addField(`UNSUSPENDED`,
`\n Cezalıdan Çıkarılan Kullanıcı: ${member.user} \n\n Çıkaran: \`${message.author.username}\` \n\n Çıkarılma Sebebi: ${sebep1} `)
client.channels.get('734196714197745705').send(embed)
};

exports.conf = {
enabled: true,
guildOnly: true,
aliases: ['çıkar','unjail'],
permLevel: 0
};
exports.help = {
name: "af",
description: "Iperia Kız Kayıt",
usage: "Iperia Kayıt"
};