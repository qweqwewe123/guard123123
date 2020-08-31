const Discord = require("discord.js");

exports.run = async (client, message, args) => {
 if (!message.member.roles.has("734196610321350657")) return message.reply('Bu komutu kullanabilmek için <@&734196610321350657> rolüne sahip olmalısın.');
let member = message.mentions.members.first();
let sebep1  = args.slice(1).join("  ");
member.addRole('734196622912651397')
member.removeRole('734196650305913032')
  member.removeRole('734196645524144128')
   member.removeRole('734196645524144128')
member.removeRole('734196646203883660')
   member.removeRole('734196646203883660')
const embed = new Discord.RichEmbed()
.addField(`SUSPENDED!`,
`\nCezalıya Atılan Kullanıcı: ${member.user} \n\nCezalıya Atan: \`${message.author.username}\` \n\n Atılma Sebebi: ${sebep1} `)
client.channels.get('734196714197745705').send(embed)
};

exports.conf = {
enabled: true,
guildOnly: true,
aliases: ['ceza','prison','cezalı'],
permLevel: 0
};
exports.help = {
name: "jail",
description: "Iperia Kız Kayıt",
usage: "Iperia Kayıt"
};