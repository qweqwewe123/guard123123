const Discord = require('discord.js');
const bot = new Discord.Client()
const ayarlar = require('./ayarlar.json');
const express = require('express');
const app = express();
const http = require('http');
const shard = new Discord.ShardingManager('./bot.js', {
    totalShards: 'auto',
    token: ayarlar.token
});

shard.spawn(); 

setTimeout(() => {
    shard.broadcastEval("process.exit()");
}, 21600000);