const chalk = require('chalk');
const moment = require('moment');
const Discord = require('discord.js');
const ayarlar = require('../ayarlar.json');
var prefix = ayarlar.prefix;
module.exports = client => {
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Bot aktif durumdadır.`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: ${client.user.username}`);
  client.user.setStatus("streaming");
  client.user.setGame(`Saygı ୪ Ata Buba`, 'https://www.twitch.tv/patron_vevo');
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Oyun bölümü ayarlandı.`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] BOT: Şu an ` + client.channels.size + ` adet kanala, ` + client.guilds.size + ` adet sunucuya ve ` + client.guilds.reduce((a, b) => a + b.memberCount, 0).toLocaleString() + ` kullanıcıya hizmet veriliyor!`);
  console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Hey! ,Bot Kullanılmaya Hazır.`)
};