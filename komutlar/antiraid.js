const Discord = require('discord.js');
 const db = require('quick.db');
 const ayarlar = require('../ayarlar.json') 
exports.run = async (client, message, args) => {
 let prefix = ayarlar.prefix 
 let aktif = await db.fetch(`botkoruma.technocode_${message.guild.id}`) 
if (aktif) {
 db.delete(`botkoruma.technocode_${message.guild.id}`) 
message.channel.send(`Bot eklendiğinde atılması için ayarlanmış sistem başarıyla kapatıldı`)
 } 
if (!aktif) {
 db.set(`botkoruma.technocode_${message.guild.id}`, 'aktif') 
message.channel.send(`Başarılı! Artık sunucuya bot eklendiğinde otomatik olarak güvenlik sebebiyle atılacak`) 
}
 }; exports.conf = { 
enabled: true,
 guildOnly: false,
 aliases: ['antiraid'],
 permLevel: 4
 }; exports.help = { 
name: 'anti-raid', 
description: 'Saldırı botlarından sizi korur.',
usage:'bot-güvenlik-sistemi'
};