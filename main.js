// Import dependencies
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const config = require('./config.json');

// Create Discord client
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] 
});

// Listen for !play command
client.on('messageCreate', async message => {
  if (message.content.startsWith('!play')) {

    // Get YouTube link from command
    const url = message.content.split(' ')[1];
    
    // Get voice channel of message author
    const voiceChannel = message.member.voice.channel;
        
    // Join the same voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    // Subscribe to audio extractor 
    const stream = ytdl(url, { filter: 'audioonly' });
    const resource = createAudioResource(stream);
    connection.subscribe(resource);

    // Get video info to send now playing message
    const info = await ytdl.getInfo(url);
    message.channel.send(`Now playing ${info.videoDetails.title}`);

  }
});

// Login with bot token
client.login(config.token);