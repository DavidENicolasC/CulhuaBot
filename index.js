///SERVICIO WEB PARA MANTENER EL BOT ACTIVO
const express = require('express')
const app = express()
app.get('/', function (req, res) {
res.send('Hello World')
})
let port = process.env.PORT || 3000;
app.listen(port)
require('dotenv').config()

//LLAMA AL PAQUETE DISCORD.JS, QUE SE COMUNICA CON LA API DE DISCORD
const Discord = require("discord.js")

//LLAMA AL PAQUETE TWIT, QUE SE COMUNICA CON LA API DE TWITTER
const Twit = require("twit")

//ESTE OBJETO REPRESENTA AL BOT DE TWITTER
var tweetbot = new Twit({
  consumer_key: process.env.TWITTER_API_KEY,
  consumer_secret: process.env.TWITTER_API_KEY_SECRET,
  access_token: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  timeout_ms: 60 * 1000,
  strictSSL: true
})

//ESTE OBJETO REPRESENTA AL BOT DE DISCORD
const culhuabot = new Discord.Client();

//ESTA FUNCION SE EJECUTA AL ENCENDERSE EL BOT
culhuabot.on("ready", () => {
  //INFORMA DESDE LA CONSOLA DEL PROGRAMADOR QUE ESTÁ ENCENDIDO
  console.log("¡CulhuaBot listo!");
});

//SE EJECUTA CUANDO SE ENVIA UN MENSAJE A UN SERVIDOR
culhuabot.on("message", (msj) => {
  //OCURRR QUE EL USUARIO ENVIA UN MENSAJE QUE EMPIEZA CON EL COMANDO !TWITTER
  if (msj.content.length > 0 && msj.content.startsWith('!twitter')) {
    //SE SALTA LOS CARACTERES !TWITTER Y SI HAY UN ESPACIO, SE LO SALTA
    msj.content = msj.content.slice(8)
    if (msj.content.length > 0 && msj.content.startsWith(' ')) { msj.content = msj.content.slice(1) }

    //SI NO HAY MAS TEXTO, LE MOSTRAMOS LA DOCUMENTACION DEL COMANDO !TWITTER
    if (msj.content.length === 0) {
      const embed = new Discord.MessageEmbed()

        .setAuthor(culhuabot.user.username, culhuabot.user.avatarURL())
        .setColor(0x0389A9)
        .setTitle('Comando !twitter')
        .setDescription('Subcomandos')
        .addField('follow - Sigue a un usuario y publica sus tweets en un canal', '**!twitter follow _id_ _#canal_**\n\nEj: **!twitter follow 0302842 #avisos**\n\nEl id del usuario lo puedes obtener de: https://tweeterid.com/')
        .setThumbnail('https://am-pm.co.uk/wp-content/uploads/2015/04/twitter-icon.gif')

      msj.channel.send(embed)
    } else
    //SUBCOMANDO FOLLOW - SIGUE AL USUARIO INDICADO Y PUBLICA SUS TWEETS EN UN CANAL
    if (msj.content.length > 0 && msj.content.startsWith('follow')) {
      
      //EL MENSAJE VIENE DE LA FORMA: FOLLOW ID <#ID_CANAL>

      //SE SALTA LOS CARACTERES FOLLOW Y SI HAY UN ESPACIO, SE LO SALTA
      msj.content = msj.content.slice(6)
      if (msj.content.length > 0 && msj.content.startsWith(' ')) { msj.content = msj.content.slice(1) }

      let user
      //CAPTURA EL ID DEL USUARIO DE TWITTER
      if (msj.content.length > 0) {
        user = msj.content[0]
        let i = 1
        while (i < msj.content.length && (msj.content[i] !== ' ' && msj.content[i] !== '<')) { user += msj.content[i++] }
        msj.content = msj.content.slice(i + 1)
        if(msj.content.length > 0 && msj.content.startsWith(' ')) { msj.content.slice(1) }
      }

      let channel
      //CAPTURA EL CANAL DONDE SE VAN A PUBLICAR LOS TWEETS DEL USUARIO
      if (msj.content.length > 0) {
        msj.content = msj.content.slice(2)
        channel = msj.content[0]
        let i = 1
        while (i < msj.content.length && msj.content[i] !== '>') { channel += msj.content[i++] }
        msj.content = msj.content.slice(i + 1)
      }

      //EL BOT DE TWITTER COMIENZA A SEGUIR LOS TWEETS DEL USUARIO INDICADO
      tweets = tweetbot.stream('statuses/filter', { follow: [user] })

      //CONFIRMA EN EL CANAL DONDE SE EJECUTO EL COMANDO !TWITTER EL USUARIO Y EL CANAL DE DISCORD
      msj.channel.send( `Se publicaran los tweets del usuario con id: ${user} en: <#${channel}>` )

      //OCURRE QUE EL USUARIO DE TWITTER HA TWITTEADO
      tweets.on('tweet', function (tweet) {
        /*ESTE EVENTO SE ACTIVA YA SEA QUE EL USUARIO DE
        TWITTER HAGA UN TWEET, RETWEET O ALGUIEN RESPONDA A SUS TWEETS.
        FILTRAREMOS EL TWEET DE TAL MANERA QUE SOLO LO ENVÍE A DISCORD
        CUANDO EL AUTOR SEA EL USUARIO AL QUE ESTAMOS SIGUIENDO*/
        if (tweet.user.id_str === user) {
          const url = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str

          /*INTENTA ENCONTRAR EL CANAL DONDE PUBLICAR EL TWEET.
          DE LO CONTRARIO, MUESTRA EL ERROR EN LA CONSOLA*/
          try {
            culhuabot.channels.fetch(channel).then(canal => {
              canal.send('@' + tweet.user.screen_name + ' twitteó:\n\n' + url)
            }).catch(error => {
              console.log(error)
            })
          } catch (error) {
            console.log(error)
          }
        }
      })
    }
  }    
});

//EL BOT DE DISCORD SE COMUNICA CON LA API DE DISCORD
culhuabot.login( process.env.DISCORD_TOKEN );