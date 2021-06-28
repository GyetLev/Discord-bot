Discord = require('discord.js');
const bot = new Discord.Client();

const ytdl = require("ytdl-core");
const token = 'x';

const PREFIX = '$';

var Client

var servers = {};

bot.on('ready', () => {

	/*var myVar = setInterval(myTimer, 1000);

	function myTimer() {
 	 var d = new Date();
  	//document.getElementById("demo").innerHTML = d.toLocaleTimeString();
	}*/

	console.log('A bot online!');
	
	bot.user.setActivity('Minecraft', {type: "PLAYING"}).catch(console.error);

	/*var TimedMessage = bot.channels.setInterval(channel => channel.id === '1');
	setInterval(() => {
		TimedMessage.send("Emlékeztető opkut")
	}, 5000);
	*/

	/*setInterval(() => {
		var TimedMessage = bot.channels.cache.get('1');
		TimedMessage.send('Emlékeztető opkut');
	  }, "21600000");
	*/
})

bot.on('message', (msg)=>{
	

		let args = msg.content.split(" ");
		if (args[0].substr(0, PREFIX.length) != PREFIX){
			return;
		}
		args[0] = args[0].substring(PREFIX.length);
		let messageLower = msg.content.toLocaleLowerCase();
		let reaction = reactions[messageLower];
		if (reaction != undefined)
		{
			msg.channel.send(reaction);
			return;
		}
		if (commands[args[0]] != undefined)
		{
			commands[args[0]](msg, args);
			return;
		}

})

var reactions = {
	
	"Legyen béke": "és szeretet",

}


var commands = {

	"play": (msg, args) =>
	{		
			
			if(!args[1]){
				msg.channel.send("Hiányzó link!\n\nHasználat: ``$play link``")
				return;
			}
			
			//guild.member(message.author);
			
			//getvoice function
			let voiceinfo = getvoice(msg.author.id);
			
			if(voiceinfo == null){
				msg.channel.send("Lépj be egy beszélgető szobába, ahova belátok.")
				return;
			}
			let voicechannel = voiceinfo.guildmember.voice.channel;
			let guildid = voiceinfo.guild.id;
			if(!servers[guildid]) servers[guildid] = {
				queue: []
			}
			var server = servers[guildid];			

			//console.log(voicechannel);

			if (!server.dispatcher) {

				voicechannel.join().then(function(connection){
					play(connection, guildid);
				})
			}
			server.queue.push(args[1]);			
					
	},
	"clear": (msg, args) =>
	{
		if (msg.author.id === '1' || '2'){
			if(!args[1]) return msg.reply('Mennyit üzenetet töröljek?')
				msg.channel.bulkDelete(args[1]);
		}
	},
	"skip": (msg, args) =>
	{
		if (msg.author.id === '1'){
			
			let voiceinfo = getvoice(msg.author.id);
			if (voiceinfo == null || bot.voice == null) {
				return;
			}
			let voiceConnection = bot.voice.connections.find(con => con.channel.guild.id == voiceinfo.guild.id);
			var server = servers[voiceinfo.guild.id];
			
			
			if(server != null && server.dispatcher){
				play(voiceConnection, voiceinfo.guild.id)
				msg.channel.send('Szám átugrása!');
			}
			
		}
	},
	"stop": (msg, args) =>
	{
		if (msg.author.id === '1'){
			let voiceinfo = getvoice(msg.author.id);
			if (voiceinfo == null || bot.voice == null) {
				return;
			}
			let voiceConnection = bot.voice.connections.find(con => con.channel.guild.id == voiceinfo.guild.id);
			var server = servers[voiceinfo.guild.id];
			if(voiceConnection){
				
				server.dispatcher.end();
				delete servers[voiceinfo.guild.id];
				//msg.channel.send('Végetért a lista, elhagyom a szobát, jóéjt :wave: !')
				console.log('Zene megállítva');

				voiceConnection.disconnect();
				msg.channel.send('Vége a zenéknek');
			}
			
		}
	},
	"q": (msg, args) =>
	{	
		if (msg.author.id === '1') {

			let voiceinfo = getvoice(msg.author.id);
			if (voiceinfo == null || bot.voice == null) {
				return;
			}
			var server = servers[voiceinfo.guild.id];

			if (server != null && server.queue != null) {
				if (server.queue.length == 0) {
					return;
				}

				let output = "";
				for (let index = 0; index < server.queue.length; index++) {
					const element = server.queue[index];
					output += element+"\r\n"
					
				}
				msg.channel.send(output);
			}

		}
	},

	
	"say": (msg, args) =>
	{
		if (msg.author.id === '1') {

			if (msg.mentions.channels.size == 0) {
				msg.channel.send("Válassz csatornát.");
			}else{

				let targetChannel = msg.mentions.channels.first();
				const args = msg.content.split(" ").slice(2);
				let saytext = args.join(" ");
				targetChannel.send(saytext);
				//msg.delete();
			}
		}
	},
	"send": (msg, args) =>
	{
		if (msg.author.id === '1') {			
				
			mentiondm = msg.mentions.users.first();
            if(mentiondm == null){
				return msg.reply('Nem küldhető el az üzenet');
			}
            mentionMessage = msg.content.slice(29);
            mentiondm.send(mentionMessage);            
			console.log('Üzenet elküldve!')						
		}
	},

	"kick": (msg, args) =>
	{
		if (msg.author.id === '1') {			
			
			const member = msg.mentions.users.first();
			const memberTarget = msg.guild.members.cache.get(member.id)
			memberTarget.kick();
			msg.channel.send("Fiók ki rúgva a szobából")
								
		}else{
			msg.channel.send('Ezt nem teheted meg')
		}
	},

	"ban": (msg, args) =>
	{
		if (msg.author.id === '1') {
			
			const member = msg.mentions.users.first();
			const memberTarget = msg.guild.members.cache.get(member.id)
			memberTarget.ban();
			msg.channel.send("Fiók ki lett tiltva")
								
		}else{
			msg.channel.send('Ezt te nem teheted meg')
		}				

	},


	"ping": (msg, args) =>
	{
		msg.channel.send('Pong!');
	},

	"bothelp": (msg, args) =>
	{
		msg.channel.send('Elérhető parancsok:\n``$help\n$ping\n$moodle\n$elektro\n$digtech\n$web\n$prog\n$adatstrukt``\n\nPrivát parancsok:\n``$play\n$stop\n$skip\n$clear\n$say\n$send``');
	},
	/*
	"országos": (msg, args) =>
	{
		msg.channel.send('V csúcsok száma, F, országok száma = élek száma + 2');
		msg.channel.send('V + F = E + 2');
	},
	"fox": (msg, args) =>
	{
		msg.channel.send('Fokszám = Kettőször az élek száma');
		msg.channel.send('F = E x 2');
	},
	"osztó": (msg, args) =>
	{
		msg.channel.send('Sima zárójel legnagyobb közös osztó (a,b)');
	},
	"szorzó": (msg, args) =>
	{
		msg.channel.send('Szögletes zárójel legkisebb közös többszörös [a,b]');
	},*/

	"moodle": (msg, args)  =>
	{
		msg.channel.send('Moodle');
	},
	"irtech": (msg, args) =>
	{
		msg.channel.send('((Szerda: 8:00-10:00))\nTeams');
	},
	"mérés": (msg, args) =>
	{
		msg.channel.send('((Kedd: 8:00-10:00))\nTeams');
	},
	"adatbé": (msg, args) =>
	{
		msg.channel.send('Kedd: 16:00-18:00\n');
	},
	"digrendsz": (msg, args) =>
	{
		msg.channel.send('Konzi: Kedd: 12:00-16:00\nMoodle');
	},
	"opkut": (msg, args) =>
	{
		msg.channel.send('Szerda: 14:00-16:00\nBBB');
	},
	"valszám": (msg, args) =>
	{
		msg.channel.send('Hétfő: 10:00-12:00\nBBB');
	},
	"oprendsz": (msg, args) =>
	{
		msg.channel.send('Moodle');
	},
	"adatstrukt": (msg, args) =>
	{
		msg.channel.send('Hétfő: 12:00-14:00\nSzerda: 12:00-13:00\nTeams');		
	},
	"tördism": (msg, args) =>
	{
		msg.channel.send('Hétfő: 12:00-14:00\nZoom');
	},	
	"órarend": (msg, args) =>
	{
		msg.channel.send('https://cdn.discordapp.com/attachments/557885648053469184/810550514251989032/unknown.png');
	},
	"help": (msg, args) =>
	{
		msg.channel.send('Parancsok:\n``$moodle\n$irtech\n$mérés\n$adatbé\n$digrendsz\n$opkut\n$valszám\n$oprendsz\n$adatstrukt\ntördism\n\n$órarend``');
		//\n\n$szorzó\n$országos\n$[]\n$()\n
	},

}

function getvoice(userid) {

	let guildsarray = bot.guilds.cache.array();
	//console.log(guildsarray);

	for (let index = 0; index < guildsarray.length; index++) {
		const guild = guildsarray[index];
		
		let guildmember = guild.members.cache.find(user => user.id == userid);
		//console.log(guildmember);
		if (guildmember != null && guildmember.voice != null && guildmember.voice.channel != null) {
			return {
				guildmember: guildmember, 
				guild: guild
			};
		}
	}
	return null;
}

function play(connection, guildid){
	var server = servers[guildid];

	server.dispatcher = connection.play(ytdl(server.queue[0], {filter: "audioonly"}));
	server.queue.shift();
	server.dispatcher.on("end", function(){
		if(server.queue[0]){
			play(connection, guildid);
		}else{
			connection.disconnect();
		}
	});
}

bot.on('message', (msg)=>{


	function getCurrentTimestamp()
	{
		var now = new Date();

		/*
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		*/

		/*var hours = now.getHours();
		hours = (hours < 10 ? "0" + hours : "" + hours);
		var minutes = now.getMinutes();
		minutes = (minutes < 10 ? "0" + minutes : "" + minutes);
		var seconds = now.getSeconds();
		seconds = (seconds < 10 ? "0" + seconds : "" + seconds);
		return "[" + hours + ":" + minutes + ":" + seconds + "]";*/

		var today = new Date();
		var dd = String(today.getDate()).padStart(2, '0');
		var mm = String(today.getMonth() + 1).padStart(2, '0');
		var yyyy = today.getFullYear();

		today = yyyy + '/' + mm + '/' + dd;

		
		var hours = now.getHours();
		hours = (hours < 10 ? "0" + hours : "" + hours);
		var minutes = now.getMinutes();
		minutes = (minutes < 10 ? "0" + minutes : "" + minutes);
		var seconds = now.getSeconds();
		seconds = (seconds < 10 ? "0" + seconds : "" + seconds);
		return "[" + today + " " + hours + ":" + minutes + ":" + seconds + "]";
	}

	//require('log-timestamp');
	console.log(getCurrentTimestamp() + ' ' + msg.author.username+": "+msg.content);
	

	if (msg.author.id === '1'){
		if(msg.content.includes("béke")){
			msg.channel.send("...és szeretet!")
		}
	}

	/*if(msg.content.includes("[]")){
		msg.channel.send("legkisebb közös többszörös")
	}

	if(msg.content.includes("()")){
		msg.channel.send("legnagyobb közös osztó")
	}

	}*/

	if(msg.content.includes("játék")){

		var games = [];
			games.push("Siege")
			games.push("CSGO")
			
		var random = parseInt(Math.random()*games.length)
				
		msg.channel.send(games[random])
	}

	if(msg.content.includes("randomszám")){
		
		var links = [];
			links.push("valami")

		var random = parseInt(Math.random()*links.length)
			
		msg.channel.send(links[random])		
	}	

/*
	if (msg.author.id === '1'){
		if(msg.content.includes("")){
			msg.channel.send("Valamit írtál, válaszolok")
		}
	}
	
	if (msg.author.id === '1'){
		if(msg.content.includes("Erre válaszolj!")){
			msg.channel.send("Válaszolok")
		}
	}else{
		msg.channel.send("Ezt nem teheted meg")
	}*/
})

bot.login(token);