require('dotenv').config();
const fetch = require("node-fetch");
const {Client, Message, WebhookClient, MessageEmbed, RichEmbed} = require('discord.js');

const webhookClient = new WebhookClient(
    process.env.WEBHOOK_ID,
    process.env.WEBHOOK_TOKEN,
);

const client = new Client();

const prefix = '#';
client.on('ready', () =>{
    console.log(`${client.user.tag} has looged in`);
});

client.on('message', async (message) =>{
    if(message.author.bot)
        return;
    if( message.content === 'hello'  ){
        message.channel.send('HELLO');
    }
    if(message.content.startsWith(prefix)){
        const [cmd_name, ...args] = message.content
        .trim()
        .substring(prefix.length)
        .split(/\s+/);

        if(cmd_name === 'inspire'){

            try{
                const response = await fetch("https://zenquotes.io/api/random");
                const data = await response.json();
                message.channel.send(data[0]["q"] + "-"+ data[0]["a"]);
                //console.log(typeof(data));
            }catch(err){
                console.log(err);
            }
        }else if(cmd_name === 'kick'){
            if(args.length === 0){
                return message.reply('Provid an ID');
            }
            const member = message.guild.members.cache.get(args[0]);
            if(member){
                member
                .kick()
                .then((member) => message.channel.send(`${member} was kicked`))
                .catch((err) => message.channel.send('Dont have permission'));
            }else{
                message.channel.send('Not found');
            }
        }
        else if(cmd_name === 'ban'){
            if(!message.member.hasPermission('BAN_MEMBERS'))
                return message.reply('dont have permission');
            if(args.length === 0){
                return message.reply('Provid an ID');
            }
            message.guild.members.ban(args[0])
            .then((member) => message.channel.send(`${member} was banned`))
            .catch((err) => console.log(err));
            
        }
        else if(cmd_name === 'announce'){
            const msg = args.join(' ');
            webhookClient.send(msg);
            //message.channel.send(msg);
        }else if(cmd_name === 'qrcode'){
            const extraArgs = args.splice(1);
            const qrCodeImage= new RichEmbed().setImage(`https://chart.googleapis.com/chart?cht=qr&chs=250x250&chl=${extraArgs}`)
            message.channel.send( qrCodeImage );
        }
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
//console.log(process.env.DISCORD_BOT_TOKEN);

