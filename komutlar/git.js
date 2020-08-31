const Discord = require("discord.js");
const ayarlar = require("../ayarlar.json")
const filter = m => m.content.includes('discord');
module.exports.run = async (client, message, args) => {
const msg = message;
const reactionFilter = (reaction, user) => {
    return ['✅'].includes(reaction.emoji.name) && user.id === msg.mentions.users.first().id;
}


if (!msg.mentions.users.first()) return;

msg.mentions.users.first().send(`Merhaba ${msg.mentions.users.first().username}, ${msg.author} bulunduğun sesli kanala gelmek istiyor, kabul ediyor musun?\n*Unutma, 10 saniye içerisinde onaylamazsan istek iptal edilecek.*`).then(async (asd) => {
    await asd.react("✅");
    asd.awaitReactions(reactionFilter, {
        max: 1,
        time: 10000,
        errors: ['time']
    }).then(async(c) => {
        if (!msg.guild.member(msg.mentions.users.first()).voiceChannel){
            msg.author.send(`Kişi isteğini onayladı fakat herhangi bir odada yok, bir odaya girip tekrar istek gönder.`);
            msg.mentions.users.first().send(`Herhangi bir odada olmadığın için onay başarısız.`);
            return;
        }
 await msg.member.setVoiceChannel(msg.guild.member(msg.mentions.users.first()).voiceChannelID);
        asd.delete();
    }).catch(async(e) =>{
    })
})
msg.channel.send(`Merhaba ${msg.mentions.users.first().username}, ${msg.author} bulunduğun sesli kanala gelmek istiyor, kabul ediyor musun?\n*Unutma, 10 saniye içerisinde onaylamazsan istek iptal edilecek.*`).then(async (asd) => {
    await asd.react("✅");
    asd.awaitReactions(reactionFilter, {
        max: 1,
        time: 10000,
        errors: ['time']
    }).then(async(c) => {
        if (!msg.guild.member(msg.mentions.users.first()).voiceChannel){
            msg.channel.send(`Kişi isteğini onayladı fakat herhangi bir odada yok, bir odaya girip tekrar istek gönder.`);
            msg.mentions.users.first().send(`Herhangi bir odada olmadığın için onay başarısız.`);
            return;
        }
        await msg.member.setVoiceChannel(msg.guild.member(msg.mentions.users.first()).voiceChannelID);
        asd.delete();
    }).catch(async(e) =>{
    })
})

}
 module.exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ["subzero"],
  category: "admin",
  permLevel: 0
};

module.exports.help = {
  name: 'git',
  description: 'Subzero',
  usage: 'prefix+git etiket '
}