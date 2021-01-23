const colors = require('colors')
const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const moment = require('moment');

const regex = new RegExp(/(discord.gift|discord.com|discordapp.com\/gifts)\/\w{16,25}/gim);

const {
    token
} = require('./config.json');

client.on('ready', () => {
    console.log(colors.blue(`
   ███████╗███╗   ██╗██╗██████╗ ███████╗
   ██╔════╝████╗  ██║██║██╔══██╗╚══███╔╝
   ███████╗██╔██╗ ██║██║██████╔╝  ███╔╝ 
   ╚════██║██║╚██╗██║██║██╔═══╝  ███╔╝  
   ███████║██║ ╚████║██║██║     ███████╗
   ╚══════╝╚═╝  ╚═══╝╚═╝╚═╝     ╚══════╝   
   ||=======================================||
           Logged as: ` + client.user.tag + `
           Sniping on ` + client.guilds.size + ` servers 
   ||=======================================||
   `))
});

client.on('message', message => {
    const content = message.content;

    // check on nitro code
    if (message.content.includes("discord.gift/") || message.content.includes('discordapp.com/gifts/')) {
        const split = content.split(" ");

        split.forEach(code => {
            if (code.includes("discord.gift/") || code.includes('discordapp.com/gifts/')) {
                // MESSAGE IS NITRO CODE

                const nitrocode = code.split("/");

                const toredeem = nitrocode[1];

                request.post("https://discordapp.com/api/v6/entitlements/gift-codes/" + toredeem + "/redeem", {
                    headers: {
                        "Authorization": token
                    }
                }, function (error, response, body) {
                    if (error) {
                        return;
                    } else {
                        const nojson = JSON.parse(response.body);

                        const message = nojson.message;

                        if(message == "Unknown Gift Code") {
                            // unknown or fake code

                            console.log("[ " + colors.gray(moment().format('LTS')) + " ] " + colors.red("[ ! ] Unknown gift code.."));
                        } else if(message.includes("This gift has been redeemed already")) {
                            // already redeemed

                            console.log("[ " + colors.gray(moment().format('LTS')) + " ] " + colors.red("[ ! ] Code has been redeemed already!"));
                        } else {
                            // code is valid

                            console.log("[ " + colors.gray(moment().format('LTS')) + " ] " + colors.green("[ ! ] Gift code has been sniped"));
                        }
                        
                    }
                })
            }
        })
    }
});

client.login(token);