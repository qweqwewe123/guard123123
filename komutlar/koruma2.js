const Discord = require('discord.js')
const fs = require('fs');
const db = require('quick.db')
var ayarlar = require('../ayarlar.json');
 
exports.run = async (client, message,  args) => {
 
if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply(`Yeterli yetki bulunmamakta.`);
 
  const db = require('quick.db');
 
  let Kanal = message.mentions.channels.first()
    if(args[0] === 'kapat') {
   if (db.has(`rolkorumakanal_${message.guild.id}`) === true) {
     message.channel.send(`Rol koruma kanalı başarıyla kaldırıldı`)
     db.delete(`rolkorumakanal_${message.guild.id}`)
     return
}
  message.channel.send(`Rol koruma kanalı ayarlanmamış.`)
    return
 
  }
     
 
    if (!Kanal) {
        return message.reply("Lütfen bir kanal belirtiniz.")
    }
 
    db.set(`rolkorumakanal_${message.guild.id}`, "<#"+Kanal.id+">")
 
    message.channel.send(`ROLKORUMAKanalı aktif edildi.`)
}
 
   
exports.conf = {
    enabled: true,
    guildOnly: false,
    aliases: ['rol-koruma'],
    permLevel: 4
}
 
exports.help = {
    name: 'rol-koruma',
    description: 'Anti-raid özelliği aktif eder.',
    usage: 'rol-koruma',
}