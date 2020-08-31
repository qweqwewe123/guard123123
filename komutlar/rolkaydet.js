const db = require('quick.db')
const Discord = require('discord.js')
const ayarlar = require('../ayarlar.json');

exports.run = async (client, message, args) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.reply('Bu komutu kullanabilmek için YÖNETİCİ iznine sahip olmalısın!');
  let prefix = await require('quick.db').fetch(`prefix_${message.guild.id}`) || ayarlar.prefix
  if (!args[0]) return message.channel.send(`Bu Ayarı Kullanabilmek için \`aç\` ya da \`kapat\` yazmalısın! |  \`${prefix}rolkaydet aç/kapat\``)
  
  if (args[0] == 'aç') {
    message.channel.send(`Rol kaydetme özelliği başarıyla aktifleştirildi!`)
    db.set(`cikisrol.${message.guild.id}`, 'acik')
  }
  
  if (args[0] == 'kapat') {
    message.channel.send(`Rol kaydetme özelliği başarıyla devre dışı bırakıldı!`)
    db.delete(`cikisrol.${message.guild.id}`)
  }

};

exports.conf = {
  enabled: true,
  guildOnly: true,
  aliases: ['rol4kaydet'],
  permLevel: 4
};

exports.help = {
  name: 'rolkaydet',
  description: 'Sunucudan çıkanların rollerini sunucuya tekrar girdiklerinde oto olarak verir.',
  usage: 'rolkaydet aç/kapat',
  kategori: 'sunucu'
};