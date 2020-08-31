const Discord = require("discord.js");
const client = new Discord.Client();
const ayarlar = require("./ayarlar.json");
const chalk = require("chalk");
const moment = require("moment");
var Jimp = require("jimp");
const { Client, Util } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");
const http = require("http");
const express = require("express");
require("./util/eventLoader")(client);
const path = require("path");
const request = require("request");
const snekfetch = require("snekfetch");
const queue = new Map();
const YouTube = require("simple-youtube-api");
const ytdl = require("ytdl-core");

const app = express();
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping tamamdır.");
  response.sendStatus(200);
});
app.listen(process.env.PORT);
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

var prefix = ayarlar.prefix;

const log = message => {
  console.log(`${message}`);
};

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
fs.readdir("./komutlar/", (err, files) => {
  if (err) console.error(err);
  log(`${files.length} komut yüklenecek.`);
  files.forEach(f => {
    let props = require(`./komutlar/${f}`);
    log(`Yüklenen komut: ${props.help.name}.`);
    client.commands.set(props.help.name, props);
    props.conf.aliases.forEach(alias => {
      client.aliases.set(alias, props.help.name);
    });
  });
});

client.reload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.load = command => {
  return new Promise((resolve, reject) => {
    try {
      let cmd = require(`./komutlar/${command}`);
      client.commands.set(command, cmd);
      cmd.conf.aliases.forEach(alias => {
        client.aliases.set(alias, cmd.help.name);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.unload = command => {
  return new Promise((resolve, reject) => {
    try {
      delete require.cache[require.resolve(`./komutlar/${command}`)];
      let cmd = require(`./komutlar/${command}`);
      client.commands.delete(command);
      client.aliases.forEach((cmd, alias) => {
        if (cmd === command) client.aliases.delete(alias);
      });
      resolve();
    } catch (e) {
      reject(e);
    }
  });
};

client.elevation = message => {
  if (!message.guild) {
    return;
  }
  let permlvl = 0;
  if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
  if (message.member.hasPermission("ADMINISTRATOR")) permlvl = 3;
  if (message.author.id === ayarlar.sahip) permlvl = 4;
  return permlvl;
};

var regToken = /[\w\d]{24}\.[\w\d]{6}\.[\w\d-_]{27}/g;
 //client.on('debug', e => {
  //console.log(chalk.bgBlue.green(e.replace(regToken, 'that was redacted')));
// });

client.on("warn", e => {
  console.log(chalk.bgYellow(e.replace(regToken, "that was redacted")));
});

client.on("error", e => {
  console.log(chalk.bgRed(e.replace(regToken, "that was redacted")));
});

client.login(ayarlar.token);

client.on("roleDelete", async role => {
  let kanal = await db.fetch(`rolk_${role.guild.id}`);
  if (!kanal) return;
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_DELETE" })
    .then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.hasPermission("ADMINISTRATOR")) return;
  role.guild.createRole({
    name: role.name,
    color: role.hexColor,
    permissions: role.permissions
  });

  const embed = new Discord.RichEmbed()
    .setTitle(`Bir rol silindi!`)
    .addField(`Silen`, entry.executor.tag)
    .addField(`Silinen Rol`, role.name);
  client.channels.get(kanal).send(embed);
});

client.on("roleCreate", async role => {
  let kanal = await db.fetch(`rolk_${role.guild.id}`);
  if (!kanal) return;
  const entry = await role.guild
    .fetchAuditLogs({ type: "ROLE_CREATE" })
    .then(audit => audit.entries.first());
  if (entry.executor.id == client.user.id) return;
  if (entry.executor.hasPermission("ADMINISTRATOR")) return;
  role.delete();
  const embed = new Discord.RichEmbed()
    .setTitle(`Bir rol açıldı!`)
    .addField(`Açan`, entry.executor.tag)
    .addField(`Açılan Rol`, role.name);
  client.channels.get(kanal).send(embed);
});


client.on("roleUpdate", async function(oldRole, newRole) {
 
  const Kanal = db.fetch(`rolkorumakanal_${oldRole.guild.id}`).replace("<#", "").replace(">", "")
  let koruma = (`rolkoruma_${oldRole.guild.id}`)//db limi olcak dbli yapıcam ayar şeyni istersen
 
  if(Kanal === null)return;
   const bilgilendir = await newRole.guild.fetchAuditLogs({type: "ROLE_UPLATE"}).then(hatırla => hatırla.entries.first())
    let yapanad = bilgilendir.executor;
  let idler = bilgilendir.executor.id;
 // yapan kişinin id si bu ise bir şey yapma
  if(oldRole.hasPermission("ADMINISTRATOR")) return
 
   setTimeout(() => {
 
     if(newRole.hasPermission("ADMINISTRATOR")){
   newRole.setPermissions((newRole.permissions-8))    
       
 }
     
 if(newRole.hasPermission("ADMINISTRATOR")){
 
     if(!client.guilds.get(newRole.guild.id).channels.has(Kanal)) return newRole.guild.owner.send(`Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi** Alındı. \Rol: **${newRole.name}**`)//bu id ye sahip kanal yoksa sunucu sahibine yaz
 
  client.channels.get(Kanal).send(`Rol Koruma Nedeniyle ${yapanad} Kullanıcısı Bir Role Yönetici Verdiği İçin Rolün **Yöneticisi Alındı**. \Rol: **${newRole.name}**`)// belirtilen id ye sahip kanala yaz
 }
      }, 1000)
  })

client.on("guildMemberAdd", member => {
  var moment = require("moment")
  require("moment-duration-format")
  moment.locale("tr")
   var {Permissions} = require('discord.js');
   var x = moment(member.user.createdAt).add(3, 'days').fromNow()
   var user = member.user
   x = x.replace("birkaç saniye önce", " ")
   if(!x.includes("önce") || x.includes("sonra") ||x == " ") {
   var rol = member.guild.roles.get("734196622912651397") ///Cezalı Rol ID'si
   var kayıtsız = member.guild.roles.get("734196650305913032") 
   member.removeRole('734196650305913032')///Kayıtsız rolü ID'si
   member.addRole(rol)
member.user.send('Hesabınız 3 günden önce açıldığı için cezalıya atıldınız, yetkililere bildirerek açtırabilirsiniz.')
setTimeout(() => {

        member.removeRole(kayıtsız.id);

}, 1000)

  ///
    
   }
        else {

        }  
    });

/////////////////////////////////
client.on("roleDelete", async (role) => {
  let guild = role.guild;
  if(!guild.me.hasPermission("MANAGE_ROLES")) return;
  let koruma = db.fetch(`korumaacik_${role.guild.id}`)
  if(koruma == null) return; 
  let e = await guild.fetchAuditLogs({type: 'ROLE_DELETE'});
  let member = guild.members.get(e.entries.first().executor.id);
  if(!member) return;
  if(member.hasPermission("ADMINISTRATOR")) return;
  let mention = role.mentionable;
  let hoist = role.hoist;
  let color = role.hexColor;
  let name = role.name;
  let perms = role.permissions;
  let position = role.position
  role.guild.createRole({
    name: name,
    color: color,
    hoist: hoist,
    position: position,
    permissions: perms,
    mentionable: mention
  }).then(rol => {
    if(!db.has(`korumalog_${guild.id}`)) return;
    let logs = guild.channels.find(ch => ch.id === db.fetch(`korumalog_${guild.id}`));
    if(!logs) return db.delete(`korumalog_${guild.id}`); else {
      const embed = new Discord.RichEmbed()
      .setDescription(`Silinen Rol: <@&${rol.id}> (Yeniden oluşturuldu!)\nSilen Kişi: ${member.user}`)
      .setColor('RED')
      .setAuthor(member.user.tag, member.user.displayAvatarURL)
      logs.send(embed);
    }
})
  
  
  
})
////////////////
client.on('guildMemberRemove', async (member) => {
const data = require('quick.db')
const da = await data.fetch(`sağ.tık.kick.${member.guild.id}`)
if(!da) return;
const kanal_id = await data.fetch(`sağ.tık.kick.kanal.${member.guild.id}`)
let kanal = client.channels.get(kanal_id)

let logs = await member.guild.fetchAuditLogs({type: 'MEMBER_KICK'});
if(!logs.entries.first().executor) return;
let kişi = member.guild.members.get(logs.entries.first().executor.id)
if(kişi.id === member.guild.owner.id) return;
kişi.roles.forEach(r => {
kişi.removeRole(r.id) })
member.addRole("734196622912651397")
const emb = new Discord.RichEmbed()
.setAuthor(kişi.user.username, kişi.user.avatarURL)
.setFooter(`${client.user.username}`)
.setTimestamp()

kanal.send(emb.setDescription(`${kişi.user.tag} isimli kişi birisini atmaya çalıştı, attı ama ben yetkilerini aldım.`))
member.guild.owner.send(emb.setDescription(`${kişi.user.tag} isimli kişi birisini atmaya çalıştı, attı ama ben yetkilerini aldım.`))
console.log('ata')
})// codare

client.on('guildBanAdd', async (guild, user) => {
const data = require('quick.db')

const da = await data.fetch(`sağ.tık.ban.${guild.id}`)
if(!da) return;
const kanal_id = await data.fetch(`sağ.tık.ban.kanal.${guild.id}`)
let kanal = client.channels.get(kanal_id)

let logs = await guild.fetchAuditLogs({type: 'MEMBER_BAN_ADD'});
if(logs.entries.first().executor.bot) return;
let kişi = guild.members.get(logs.entries.first().executor.id)
kişi.roles.forEach(r => {
kişi.removeRole(r.id) })
guild.unban(user)
user.addRole("734196622912651397")
const emb = new Discord.RichEmbed()
.setAuthor(kişi.user.username, kişi.user.avatarURL)
.setFooter(`${client.user.username}`)
.setTimestamp()

kanal.send(emb.setDescription(`${kişi.user.tag} isimli kişi ${user} isimli kişiyi yasaklamaya çalıştı, attı ama ben yetkilerini aldım ve kişinin yasağını kaldırdım..`))
guild.owner.send(emb.setDescription(`${kişi.user.tag} isimli kişi ${user} isimli kişiyi yasaklamaya çalıştı, attı ama ben yetkilerini aldım ve kişinin yasağını kaldırdım..`))
console.log('ata')
})// codare
///////////////////////////////////////////

	client.on("channelDelete", async function(channel) {
if(channel.guild.id !== "727943516411396129") return;
    let logs = await channel.guild.fetchAuditLogs({type: 'CHANNEL_DELETE'});
    if(logs.entries.first().executor.bot) return;
    channel.guild.member(logs.entries.first().executor).roles.filter(role => role.name !== "@everyone").array().forEach(role => {
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("734196587433295942"))
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("734196587911315550"))
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("734196590683881524"))
              channel.guild.member(logs.entries.first().executor).removeRole(channel.guild.roles.get("734196593120772187"))
    })
const sChannel = channel.guild.channels.find(c=> c.id ==="728561557835087925")
const cıks = new Discord.RichEmbed()
.setColor('RED')
.setDescription(`${channel.name} adlı Kanal silindi Silen kişinin yetkilerini alıyorum`)
.setFooter('Developed By Ata')
sChannel.send(cıks)
  
channel.guild.owner.send(` **${channel.name}** adlı Kanal silindi Silen  kişinin yetkilerini aldım`)
}) 


client.on("userUpdate", function(oldUser, newUser){

     if(oldUser.username !== newUser.username) {
       let takmaad =  client.guilds.get("727943516411396129").members.get(newUser.id).displayName
let kanal =client.channels.get('734196787254132768')

        if(!newUser.username.includes("୪") && client.guilds.get("727943516411396129").members.get(newUser.id).roles.has("734196640511950900")) {
           if(!client.guilds.get("727943516411396129").members.get(newUser.id).removeRole("734196640511950900")) return newUser.guild.owner.send("ototag rolü olmadığı için rol alınamadı")
          client.guilds.get("727943516411396129").members.get(newUser.id).removeRole("734196640511950900")
          
            let değişeceksembol1 = takmaad.replace(/taglı sembol/g, "୪");
            client.guilds.get("727943516411396129").members.get(newUser.id).setNickname(değişeceksembol1)   
           if(!kanal) return newUser.guild.owner.send("ototag bilgi kanalı olmadığı için rol verirdi ama kanala yazı yazılamadı")
            kanal.send(`${newUser}, Tagımızı Çıkardı Ve Ailemizden Ayrıldı... `)
       
        } 
         if(newUser.username.includes("୪") && !client.guilds.get("727943516411396129").members.get(newUser.id).roles.has("734196640511950900")) {
         
         
           if(!client.guilds.get("727943516411396129").members.get(newUser.id).addRole("734196640511950900"))   return newUser.guild.owner.send("ototag rolü olmadığı için rol verilemedi")
            client.guilds.get("727943516411396129").members.get(newUser.id).addRole("734196640511950900")
            let değişeceksembol2 = takmaad.replace(/tagsız sembol/g, "୪");
            client.guilds.get("727943516411396129").members.get(newUser.id).setNickname(değişeceksembol2)    
           if(!kanal) return newUser.guild.owner.send("ototag bilgi kanalı olmadığı için rol verirdi ama kanala yazı yazılamadı")
           kanal.send(`${newUser}, Tagımızı Aldı Ve Ailemize Yeni Biri Katıldı `) 
        
         }
      }
          })


client.on("message", async msg => {
  if (msg.content.toLowerCase() === '!tag') {
    msg.reply('୪');
  }
});

client.on("message", async msg => {
  if (msg.content.toLowerCase() === 'tag') {
    msg.reply('୪');
  }
});


client.on("ready", () => {
  client.channels.get("734196747714429009").join();
  
})

///////////////////////////
client.on("voiceStateUpdate", async(oldMember, newMember) => {
let seslog = await db.fetch(`seslog_${oldMember.guild.id}`);
 if (!seslog) return;
  let embed = new Discord.RichEmbed() //dcs
.setThumbnail(oldMember.user.avatarURL)
 .setTitle("Ses Kanalına Giriş")
 .addField("**Kanala Giren Kişi**", `<@${oldMember.id}>`)
 .addField("**Şuanda Bulunduğu Kanal**", `\`${newMember.voiceChannel.name}\` **|** \`${newMember.voiceChannel.id}\``) 
 .setTimestamp()
  .setColor("RED")
  client.channels.get(seslog).send(embed)
})

/////////////////////////////
client.on("guildMemberAdd", async member => {
let technoo = db.fetch(`botkoruma.technocode_${member.guild.id}`)
if(technoo !== "aktif") return; 
setTimeout(() => { 
member.guild.fetchMember(member).then(technocodeolmaz => { 
technocodeolmaz.roles.forEach(function(technocodeolur) { 
if(technocodeolur.name.includes(member.user.username)) {
 member.guild.member(member).ban(); 

member.guild.channels.find(technocoders => technocoders.name === "log").send(`Makishima Anti-Raid \n ${member.guild.owner} Sunucuya Bot Çekmeye Çalıştıklarını Bildirmek İstedim. \n__**Atılan Botun Tagı :**__ ${member.user.tag}`) 
}})})
 }, 1000) 
 });

client.on("guildMemberRemove", async(member) => {
  let rolver = await db.fetch(`cikisrol.${member.guild.id}`)
  if(!rolver) return
  let rol = [];
  member.roles.forEach(a => {
    rol.push(a.id)
  })
  db.set(`uyecikisrol.${member.user.id}`, rol)
  db.set(`uyecikisisim.${member.user.id}`, member.nickname)
})

client.on("guildMemberAdd", async(member) => {
  let rolver = await db.fetch(`cikisrol.${member.guild.id}`)
  if(!rolver) return
  let uyecikis = await db.fetch(`uyecikisrol.${member.user.id}`)
  if(!uyecikis) return
  let isim = await db.fetch(`uyecikisisim.${member.user.id}`)
  try {
    await uyecikis.forEach(x => member.addRole(member.guild.roles.get(x).id))
    await member.setNickname(isim)
    db.delete(`uyecikisrol.${member.user.id}`)
    db.delete(`uyecikisisim.${member.user.id}`)
  } catch(err) { }
})//yashinu
////////////
const iltifatlar = [
  "Mutluluk nedir sorusuna cevabımsın.",
  "Bir gülüşü var, kelebek görse ömrü uzar.",
  "Başıma gelen güzel şeylerin nedeni hep sensin.",
  "Seni düşünürken içim geçmiş, severken de ömrüm.",
  "Sıradan bir ismi nasıl da güzelleştiriyorsun sen",
  "Güneş mi doğmuş yoksa sen mi gülümsedin :)",
];

client.on("ready", async () => {
  let sunucuID = "727943516411396129"; // Sunucu ID
  let kanalID = "734196753351442453"; // Kanal ID
  let birinciRol = "734196646203883660"; // İlk rol ID (Erkek rolü)
  let ikinciRol = "734196645524144128"; // Diğer rol ID (Kız rolü)
  setInterval(() => {
    let sunucu = client.guilds.get(sunucuID);
    client.channels.get(kanalID).send(`${sunucu.members.filter(uye => (uye.roles.has(birinciRol) || uye.roles.has(ikinciRol)) && uye.presence.status !== "offline").random()} ${iltifatlar[Math.floor(Math.random() * iltifatlar.length)]}`);
  }, 10*72*50000);
});







////////
client.on("ready", (Yashinu) => {
  setInterval(async (Yashinu) => {
    let kanal = client.guilds.get('727943516411396129').channels.get('738021680269623296');

    // Eğer bota mesaj attırmayı bilmiyorsanız aşağıdaki satırı bir kere açıp bota mesaj attırın ve ID'sini alın.
     //kanal.send("Bu Mesajın ID'si:").then(x => x.edit(`Bu Mesajın ID'si: ${x.id}`));

    let mesaj = await kanal.fetchMessage("738022863965257769");
    
    let embed = new Discord.RichEmbed().setTitle('Sunucu Güncel İstatistik').setTimestamp().setFooter(mesaj.guild.name, mesaj.guild.iconURL).setColor("2F3136");
    // Aşağıdaki Embedi İstediğiniz Şekilde Düzenleyebilirsiniz. Rol belirtmek istiyorsanız bunu alt satırda gerekli yere ekleyin: ${mesaj.guild.roles.get('ROL IDSİ').members.size}
    embed.setDescription(`Toplam Üye: ${mesaj.guild.memberCount}\n\nAktif Üye: ${mesaj.guild.members.filter(uye => uye.presence.status !== "offline").size}\n\nÇevrimdışı Üye: ${mesaj.guild.members.filter(uye => uye.presence.status === "offline").size}\n\nTaglı Üye: ${mesaj.guild.roles.get('734196640511950900').members.size}`)
    embed.setColor("BLACK")
    mesaj.edit(embed);
  }, 60*1000);
});