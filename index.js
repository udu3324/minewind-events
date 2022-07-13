const Tail = require('tail').Tail;
const { Client, Intents } = require('discord.js');
const { token } = require('./token');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_PRESENCES] });

const log = "../MultiMC/instances/1.19 Minewind/.minecraft/logs/latest.log";


const channelLabyrinth = "969053026625126410";
const channelBeef = "933367060682125362";
const channelAttackOnGiant = "863975877648711691";
const channelSnowvasion = "863978973138124810";
const channelAbyssal = "863978950794805249";
const channelFoxHunt = "863979026803458080";
const channelBait = "863979084080873492";
const channelCastle = "863979109898256395";
const channelRawAlerts = "863993133422084107";

const channelChat = "863979232699219978";
const channelMarket = "863979270380453898";
const channelSharpen = "863979288763170817";
const channelVotes = "870454989544386590";
const channelNewFriend = "944018846791127060";

const pingLabyrinth = "<@&969059479666700298>";
const pingBeef = "<@&933493801954209813>";
const pingAttack = "<@&863991934988058624>";
const pingSnow = "<@&863992054593093662>";
const pingAbyss = "<@&863992157521707008>";
const pingFox = "<@&863992277705162762>";
const pingBait = "<@&863992343152689192>";
const pingCastle = "<@&863992408824086589>";

const maintainerChannel = "863978301445505024";
const pingMaintainer = "<@395649963415306242>";

function formatAMPM(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes
    return hours + ':' + minutes + ' ' + ampm
}

const maintainerLines = ["Could not connect to target server, you have been moved to a fallback server.",
    "Connection has been lost.",
    "Disconnected by Server :",
    "Server was successfully joined.",
    " Waiting 10 seconds before reconnecting..."
];

var ready = false;

var options = { flushAtEOF: true, useWatchFile: true }
const tail = new Tail(log, options);

var listenForFoxEnd = false
var foxEndString = ""
var listenForBaitEnd = false
var baitEndString = ""

tail.on("line", function (data) {
    if (!ready)
        return

    if (data.length === 0)
        return;



    //TEMPORARY CODE TEMPORARY CODE TEMPORARY CODE TEMPORARY CODE TEMPORARY CODE 
    if (/^(\[[0-9][0-9]:[0-9][0-9]:[0-9][0-9]\] \[Render thread\/INFO\]: \[CHAT\] )/.test(data)) {
        data = data.substring(40)
        data = data.replace(/\u00A7[0-9A-FK-OR]/, "").replace(/\u00A7[0-9A-FK-OR]/ig, "").replace(/�[0-9A-FK-OR]/ig, "")
        console.log(formatAMPM(new Date()) + " | " + data);
    } else {
        return
    }



    //MAINTAINER MAINTAINER MAINTAINER MAINTAINER MAINTAINER 
    if (maintainerLines.some(v => data.includes(v)))
        return sendMessage(maintainerChannel, `${data}\n${pingMaintainer}`)

    //CHAT CHAT CHAT CHAT CHAT CHAT CHAT CHAT CHAT CHAT CHAT
    if (data.includes("sell") || data.includes("buy") || data.includes("offer")) {
        sendMessage(channelMarket, data)
    } else if (/^Welcome newfriend \w{3,16}!$/.test(data)) {
        return sendMessage(channelNewFriend, data)
    } else if (/^\/vote -> .*: /.test(data)) {
        return sendMessage(channelVotes, data)
    } else if (/\w{3,16} sharpened .* to \+([1-9]|[1-2][0-9]|30)!/.test(data)) {
        return sendMessage(channelSharpen, data)
    } else {
        sendMessage(channelChat, data)
    }

    //EVENTS EVENTS EVENTS EVENTS EVENTS EVENTS EVENTS EVENTS 
    if (/(^Labyrinth Event begins in .* (hour|minute(s|))\.$|^Labyrinth event is starting...$)/.test(data)) {
        sendMessage(channelLabyrinth, `||${pingLabyrinth}||`, false)
        sendEmbed(channelLabyrinth, "Labyrinth", data, "", "ffffff")

        sendMessage(channelRawAlerts, `${data}\n||${pingLabyrinth}||`, false)
    } else if (/(^Labyrinth event has started!$)/.test(data)) {
        sendMessage(channelLabyrinth, `||${pingLabyrinth}||`, false)
        sendEmbed(channelLabyrinth, "Labyrinth", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544906917056653/labyrinth_Start.gif", "ffffff")

        sendMessage(channelRawAlerts, `${data}\n||${pingLabyrinth}||`, false)
    } else if (/(^Labyrinth event has ended!$)/.test(data)) {
        sendEmbed(channelLabyrinth, "Labyrinth", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544906510217226/labyrinth_End.gif", "ffffff")

        sendMessage(channelRawAlerts, `${data}`)
    }

    if (/(^Beef Event begins in .* (hour|minute(s|)|seconds)\.$)/.test(data)) {
        sendMessage(channelBeef, `||${pingBeef}||`, false)
        sendEmbed(channelBeef, "Beef", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544951741599834/beef_soon_upscale.png", "001E9A")

        sendMessage(channelRawAlerts, `${data}\n||${pingBeef}||`, false)
        if (/(^Beef Event begins in .* seconds\.$)/.test(data)) {
            setTimeout(function () {
                sendMessage(channelBeef, `||${pingBeef}||`, false)
                sendEmbed(channelBeef, "Beef", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544952030986270/beef_start_upscale.png", "001E9A")

                sendMessage(channelRawAlerts, `${data}\n||${pingBeef}||`, false)
            }, 10000)
        }
    } else if (/(^Team (aqua|red) wins the beef event!$)/.test(data)) {
        sendEmbed(channelBeef, "Beef", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544951540264990/beef_end_upscale.png", "001E9A")

        sendMessage(channelRawAlerts, `${data}`)
    }

    if (/^Abyssal event begins in (30|20|10|5|1) (hour|minute(s|)|seconds)\.$/.test(data)) {
        sendMessage(channelAbyssal, `||${pingAbyss}||`, false)
        sendEmbed(channelAbyssal, "Abyssal", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544980174778368/abyss_soon_upscale.png", "0537D6")

        sendMessage(channelRawAlerts, `${data}\n||${pingAbyss}||`, false)
        if (/^Abyssal event begins in 10 seconds\.$/.test(data)) {
            setTimeout(function () {
                sendMessage(channelAbyssal, `||${pingAbyss}||`, false)
                sendEmbed(channelAbyssal, "Abyssal", data, "https://media.discordapp.net/attachments/996544779926126692/996544980514521148/abyss_Start.gif", "0537D6")

                sendMessage(channelRawAlerts, `${data}\n||${pingAbyss}||`, false)
            }, 10000)
        }
    } else if (/^\w{3,16} wins the abyssal event! Poseidon is pleased!$/.test(data)) {
        sendEmbed(channelAbyssal, "Abyssal", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544981223354489/abyss_End.gif", "0537D6")

        sendMessage(channelRawAlerts, `${data}`)
    }

    if (/^Attack on Giant begins in (30|20|10|5|1) (hour|minute(s|)|seconds)\.$/.test(data)) {
        sendMessage(channelAttackOnGiant, `||${pingAttack}||`, false)
        sendEmbed(channelAttackOnGiant, "Attack on Giant", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544906149498970/giant_soon_upscale.png", "50862a")

        sendMessage(channelRawAlerts, `${data}\n||${pingAttack}||`, false)
    } else if (data === "Attack on Giant has begun!") {
        sendMessage(channelAttackOnGiant, `||${pingAttack}||`, false)
        sendEmbed(channelAttackOnGiant, "Attack on Giant", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544953306058812/attack_Start.gif", "50862a")

        sendMessage(channelRawAlerts, `${data}\n||${pingAttack}||`, false)
    } else if (data === "Attack on Giant ends!") {
        sendEmbed(channelAttackOnGiant, "Attack on Giant", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544980959109240/attack_End.gif", "50862a")

        sendMessage(channelRawAlerts, `${data}`)
    }

    if (data === "Snowmen invade the spawn!") {
        sendMessage(channelSnowvasion, `||${pingSnow}||`, false)
        sendEmbed(channelSnowvasion, "Snowvasion", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544907676233768/snowvasion_Start.gif", "ffffff")

        sendMessage(channelRawAlerts, `${data}\n||${pingSnow}||`, false)
    } else if (data === "Snowmen melt away!") {
        sendEmbed(channelSnowvasion, "Snowvasion", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544907386814464/snowvasion_End.gif", "ffffff")

        sendMessage(channelRawAlerts, `${data}`)
    }

    if (/^Fox hunt begins in (30|20|10|5|1) (hour|minute(s|)|seconds)\.$/.test(data)) {
        sendMessage(channelFoxHunt, `||${pingFox}||`, false)
        sendEmbed(channelFoxHunt, "Fox Hunt", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544905616818196/fox_soon_upscale.png", "F5E78F")

        sendMessage(channelRawAlerts, `${data}\n||${pingFox}||`, false)
    } else if (data === "Fox Hunt has begun!") {
        sendMessage(channelFoxHunt, `||${pingFox}||`, false)
        sendEmbed(channelFoxHunt, "Fox Hunt", data, "https://media.discordapp.net/attachments/996544779926126692/996544905935605791/fox_start_upscale.png", "F5E78F")

        sendMessage(channelRawAlerts, `${data}\n||${pingFox}||`, false)
    } else if (/^Fox-chan spawned at /.test(data)) {
        sendEmbed(channelFoxHunt, "Fox Hunt", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544904937353339/fox_chanSpawn_upscale.png", "F5E78F")

        sendMessage(channelRawAlerts, `${data}`)
    } else if (/^\w{3,16} has slain Fox-chan!$/.test(data)) {
        sendEmbed(channelFoxHunt, "Fox Hunt", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544904719253614/fox_chanDie_upscale.png", "F5E78F")

        sendMessage(channelRawAlerts, `${data}`)
    } else if (/^Fox Hunt event ends!$/.test(data)) {
        listenForFoxEnd = true
    } else if (/^[1-3]\) \w{3,16} -- .* foxes$/.test(data) && listenForFoxEnd) {
        foxEndString += data + "\n"
        if (/^3\) \w{3,16} -- .* foxes$/.test(data)) {
            sendEmbed(channelFoxHunt, "Fox Hunt", "Fox Hunt has ended.\n" + foxEndString, "https://cdn.discordapp.com/attachments/996544779926126692/996544905394528407/fox_end_upscale.png", "F5E78F")

            sendMessage(channelRawAlerts, `${"Fox Hunt has ended.\n" + foxEndString}`)

            foxEndString = ""
            listenForFoxEnd = false
        }
    }

    if (/^Bait Event begins in (30|20|10|5|1) (hour|minute(s|)|seconds)\.$/.test(data)) {
        sendMessage(channelBait, `||${pingBait}||`, false)
        sendEmbed(channelBait, "Bait", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544951372484688/bait_soon_upscale.png", "001E9A")

        sendMessage(channelRawAlerts, `${data}\n||${pingBait}||`, false)
        if (/^Bait Event begins in 10 seconds\.$/.test(data)) {
            setTimeout(function () {
                sendMessage(channelBait, `||${pingBait}||`, false)
                sendEmbed(channelBait, "Bait", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544953104748594/fish_Start.gif", "001E9A")

                sendMessage(channelRawAlerts, `${data}\n||${pingBait}||`, false)
            }, 10000)
        }
    } else if (/^Fishing event ends!$/.test(data)) {
        listenForBaitEnd = true
    } else if (/^[1-3]\) \w{3,16} -- .* fish$/.test(data) && listenForBaitEnd) {
        baitEndString += data + "\n"
        if (/^3\) \w{3,16} -- .* fish$/.test(data)) {
            sendEmbed(channelBait, "Bait", "Bait has ended.\n" + baitEndString, "https://cdn.discordapp.com/attachments/996544779926126692/996544952886636635/fish_End.gif", "001E9A")

            sendMessage(channelRawAlerts, `${"Bait has ended.\n" + baitEndString}`)

            baitEndString = ""
            listenForBaitEnd = false
        }
    }

    if (/^Battle for Minewind begins in (30|20|10|5|1) (hour|minute(s|)|seconds)\.$/.test(data)) {
        sendMessage(channelCastle, `||${pingCastle}||`, false)
        sendEmbed(channelCastle, "Castle", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544952458825748/castle_soon_upscale.png", "555555")

        sendMessage(channelRawAlerts, `${data}\n||${pingCastle}||`, false)
    } else if (data === "Battle for Minewind has begun!") {
        sendMessage(channelCastle, `||${pingCastle}||`, false)
        sendEmbed(channelCastle, "Castle", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544952660131962/castle_start_upscale.png", "555555")

        sendMessage(channelRawAlerts, `${data}\n||${pingCastle}||`, false)
    } else if (/( \(.*\) take the Minewind City from .* \(.*\)!$| \(.*\) hold the Minewind City!$)/.test(data)) {
        sendEmbed(channelCastle, "Castle", data, "https://cdn.discordapp.com/attachments/996544779926126692/996544952261685380/castle_end_upscale.png", "555555")

        sendMessage(channelRawAlerts, `${data}`)
    }
});

function markdownMessage(msg) {
    if (msg.includes(": >")) {
        //send it with green text
        return "```diff\n+ " + msg + "\n```";
    } else if (msg.includes(": <")) {
        //send it with red text
        return "```diff\n- " + msg + "\n```";
    } else if (msg.startsWith("* ")) {
        //send it with blue text
        return "```markdown\n# " + msg + "\n```";
    } else {
        //send it normally
        return "```diff\n" + msg + "\n```";
    }
}

tail.on('error', (err) => {
    console.log('Caught exception: ' + err);
    sendMessage(maintainerChannel, `Caught exception: \n${err}\n${pingMaintainer}`)
})

function sendMessage(channelID, message, filter) {
    if (filter == null)
        filter = true

    if (filter)
        message = markdownMessage(message.replace(/`/g, ''))

    try {
        if (message.length < 1)
            return

        if (filter)
            client.channels.cache.get(channelID).send(message.replace(/@/g, '@.'))
                .then(function (message) {
                    message.crosspost().catch();
                });
        else
            client.channels.cache.get(channelID).send(message)
                .then(function (message) {
                    message.crosspost().catch();
                });
    } catch (err) {

    }
}

function sendEmbed(channelID, title, description, image, hexColor) {
    try {
        if (image.length > 1) {
            client.channels.cache.get(channelID).send({
                embeds: [{
                    title: title.replace(/_/g, '\\_'),
                    description: description.replace(/_/g, '\\_'),
                    image: { url: image },
                    timestamp: new Date(),
                    color: "0x" + hexColor.replace(/#/g, '')
                }]
            }).then(function (message) {
                message.crosspost().catch();
            });
        } else {
            client.channels.cache.get(channelID).send({
                embeds: [{
                    title: title.replace(/_/g, '\\_'),
                    description: description.replace(/_/g, '\\_'),
                    timestamp: new Date(),
                    color: "0x" + hexColor.replace(/#/g, '')
                }]
            }).then(function (message) {
                message.crosspost().catch();
            });
        }
    } catch (err) {

    }
}
client.options.retryLimit = 500
client.options.restRequestTimeout = 60000

client.on('ready', () => {
    console.log(`credits - https://github.com/udu3324`);
    console.log(`Logged in as ${client.user.tag} at ${formatAMPM(new Date())}`);

    ready = true;
});

client.login(token);

process.on('uncaughtException', function (err) {

});

//code by udu3324