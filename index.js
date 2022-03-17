///SERVICIO WEB PARA MANTENER EL BOT ACTIVO
const express = require('express')
const app = express()
app.get('/', function (req, res) {
res.send('Hola Soy CulhuaBot')
})
let port = process.env.PORT || 3000;
app.listen(port)
require('dotenv').config()

//LLAMA AL PAQUETE DISCORD.JS, QUE SE COMUNICA CON LA API DE DISCORD
const Discord = require("discord.js")

//LLAMA AL PAQUETE TWIT, QUE SE COMUNICA CON LA API DE TWITTER
const Twit = require("twit")

//  ID DE USUARIOS QUE CULHUABOT SIGUE POR DEFECTO:
/*  ID DE INSTITUCIONES DEL IPN
[0] IPN_MX; [1] SecretariaIPN; [2] DAE_IPN;   */
/*  ID DE CLUBES DEL IPN
[3] HackmexIpn; [4] algoritmiaESCOM */
var users_id = ['302901861', '3030986693', '797251770745556992', '1147936291947986944', '1323122736']
var channel_ipn = '-1';      //ID del Discord channel donde se publican las updates del IPN
var channel_clubes = '-1';   //ID del Discord channel donde se publican las updates de Clubes y Concursos

//ESTE OBJETO REPRESENTA AL BOT DE TWITTER, QUE SE COMUNICA CON LA API DE TWITTER
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

//EL BOT DE TWITTER COMIENZA A SEGUIR LOS TWEETS DEL USUARIO INDICADO. TWEETS REPRESENTA EL STREAM
var tweets = tweetbot.stream('statuses/filter', { follow: users_id })


//EL BOT DE DISCORD SE COMUNICA CON LA API DE DISCORD
culhuabot.login( process.env.DISCORD_TOKEN );

//ESTA FUNCION SE EJECUTA AL ENCENDERSE EL BOT
culhuabot.on("ready", () => {
  //INFORMA DESDE LA CONSOLA DEL PROGRAMADOR QUE ESTÁ ENCENDIDO
  console.log("¡CulhuaBot listo!");
});

//SE EJECUTA CUANDO SE ENVIA UN MENSAJE AL SERVIDOR
culhuabot.on("message", (msj) => {
  //OCURRE QUE EL USUARIO ENVIA UN MENSAJE QUE EMPIEZA CON EL COMANDO !TWITTER
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
        .setDescription('Culhuabot puede enviar los tweets de cuentas institucionales,\
         de otros clubes y concursos a ciertos canales en tu servidor')
        .addField('IPN - publica los tweets de cuentas institucionales en el canal\
         indicado', '**!twitter IPN #canal**')
         .addField('Clubes - publica los tweets de clubes y concursos en el canal\
         indicado', '**!twitter Clubes #canal**')
        .setThumbnail('https://am-pm.co.uk/wp-content/uploads/2015/04/twitter-icon.gif')
        .setFooter('Club de Algoritmia ESIME Culhuacan', 'https://avatars.githubusercontent.com/u/101437361?s=200&v=4')

      msj.channel.send(embed)
    } else { //CAPTURA LOS ARGUMENTOS QUE SIGUEN
      //<---- EL MENSAJE VIENE CON EL FORMATO: ID <#ID_CANAL> ---->

      var comando
      //CAPTURA EL PRIMER ARGUMENTO (IPN o CLUBES) Y SI AL FINAL HAY UN ESPACIO, SE LO SALTA
      if (msj.content.length > 0) {
        comando = msj.content[0]
        let i = 1
        while (i < msj.content.length && (msj.content[i] !== ' ' && msj.content[i] !== '<')) { comando += msj.content[i++] }
        msj.content = msj.content.slice(i + 1)
        if(msj.content.length > 0 && msj.content.startsWith(' ')) { msj.content.slice(1) }
      }

      var channel
      //CAPTURA EL SEGUNDO ARGUMENTO (CANAL DE UPDATES)
      if (msj.content.length > 0) {
        msj.content = msj.content.slice(2)  //NOS SALTAMOS LOS CARACTERES <#
        channel = msj.content[0]
        let i = 1
        while (i < msj.content.length && msj.content[i] !== '>') { channel += msj.content[i++] }
        msj.content = msj.content.slice(i + 1)
      }

      //PRIMERO BUSCA EL CANAL INDICADO PARA ASEGURARSE DE QUE EXISTE
      try {
        culhuabot.channels.fetch(channel).then(canal => {
          console.log( "Encontre el canal" );
          //SI LO ENCONTRO Y EL COMANDO ES CORRECTO, CONFIRMA EL CANAL DONDE SE ENVIARAN LAS UPDATES
          if( comando === 'IPN' || comando === 'Ipn' || comando === 'ipn' ) {
            channel_ipn = channel;
            msj.channel.send( `Los tweets de las cuentas institucionales se publicaran en: <#${channel_ipn}>` );
          }
          else if( comando === 'CLUBES' || comando === 'Clubes' || comando === 'clubes' ) {
            channel_clubes = channel;
            msj.channel.send( `Los tweets de las cuentas de otros clubes y concursos se publicaran en: <#${channel_clubes}>` );
          }
          else {
            msj.channel.send( 'Lo siento, pero no puedo reconocer ese canal o comando. Escribe !twitter para saber más' );
          }
        }).catch(error => {   //DE LO CONTRARIO, NOTIFICA QUE NO ENCONTRO EL CANAL CON ESE ID
          console.log( "No encontre el canal" );
        })
      } catch (error) {   //ENCERRAMOS LA OPERACION DENTRO DE UNA ESTRUCTURA TRY.CATCH POR CUALQUIER ERROR
        console.log( 'Ocurrio un error al intentar realizar la operacion de encontrar canal:\n' + error );
      }

      //OCURRE QUE EL USUARIO DE TWITTER HA TWITTEADO
      tweets.on('tweet', function (tweet) {

        /* ESTE EVENTO SE ACTIVA EN LOS SIGUIENTES CASOS:

        - EL USUARIO AL QUE SEGUIMOS HACE UN TWEET
        - ALGUIEN RETWEETEA ALGUNA PUBLICACION DEL USUARIO QUE SEGUIMOS
        - ALGUIEN RESPONDE A SU TWEET
        - ALGUIEN RESPONDE AL RETWEET DE SU TWEET

        FILTRAREMOS EL TWEET DE TAL MANERA QUE SOLO LO ENVÍE A DISCORD
        CUANDO EL AUTOR SEA EL USUARIO AL QUE ESTAMOS SIGUIENDO */

        console.log( tweet.user.screen_name + ' ha twiteado\n' ); //INFORMA A LA CONSOLA DEL PROGRAMADOR QUE OCURRIO ESTE EVENTO

        var url = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;  //EL ENLACE DEL STREAMING ENDPOINT DESDE EL QUE SE OBTIENE EL MENSAJE
        if ( (tweet.user.id_str === users_id[0] || tweet.user.id_str === users_id[1] || tweet.user.id_str === users_id[2]) && channel_ipn != '-1' ) {
          console.log( 'El usuario detectado es valido\n' );
          /*INTENTA ENCONTRAR EL CANAL DONDE PUBLICAR EL TWEET.
          DE LO CONTRARIO, MUESTRA EL ERROR EN LA CONSOLA*/
          try {
            culhuabot.channels.fetch(channel_ipn).then(canal => {
              canal.send('<@&865028447473762345>\n'+'@' + tweet.user.screen_name + ' twitteó:\n\n' + url)
            }).catch(error => {
              console.log('Ocurrio un error al intentar encontrar el canal de Discord:\n' + error);
            })
          } catch (error) {
            console.log('Ocurrio un error al intentar realizar la operacion de encontrar canal:\n' + error);
          }
        } else if ( (tweet.user.id_str === users_id[3] || tweet.user.id_str === users_id[4]) && channel_clubes != '-1' ) {
          console.log( 'El usuario detectado es valido\n' );
          /*INTENTA ENCONTRAR EL CANAL DONDE PUBLICAR EL TWEET.
          DE LO CONTRARIO, MUESTRA EL ERROR EN LA CONSOLA*/
          try {
            culhuabot.channels.fetch(channel_clubes).then(canal => {
            canal.send('<@&865028447473762345> <@&865029023167676426>\n'+'@' + tweet.user.screen_name + ' twitteó:\n\n' + url)
            }).catch(error => {
              console.log('Ocurrio un error al intentar encontrar el canal de Discord:\n' + error);
            })
          } catch (error) {
            console.log('Ocurrio un error al intentar realizar la operacion de encontrar canal:\n' + error);
          }
        }
        else if(channel_ipn === '-1' || channel_clubes === '-1') {  //AUN NO SE HAN INDICADO CANALES DE PUBLICACION
          console.log( "Las variables que hacen referencia a los canales de Discord estan vacias" );
        }
        else {  //CUANDO EL AUTOR NO ES EL USUARIO AL QUE SEGUIMOS, LO INFORMA EN LA CONSOLA DEL PROGRAMADOR. ES UNA BUENA MANERA DE ASEGURARSE DE QUE EL STREAMING SIGUE CONECTADO
          console.log( 'El usuario detectado no es valido' );  
        }
      })
      tweets.on('disconnect', function(mensajeDesconeccion) {
        console.log("El stream de Twitter se ha desconectado");
        tweets.stop();
        tweets.start();
      })
    }
  }
});