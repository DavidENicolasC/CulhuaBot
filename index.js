///LLAVE DEL BOT
const mySecret = process.env['token']

///SERVICIO DE LA PAGINA WEB
const express = require('express')
const app = express()
app.get('/', function (req, res) {
res.send('Hello World')
})
let port = process.env.PORT || 3000;
app.listen(port)
require('dotenv').config()

///CODIGO DEL BOT
const Discord = require("discord.js");
const client = new Discord.Client();

//Descripcion del Bot
function presence() {
    client.user.setPresence({
        status: "online",
        activity: {
            name: "escribe !hola",
            type: "LISTENING"
        }
    })
}

//Se ejecuta al encenderse el bot
client.on("ready", () => {
  console.log("¡CulhuaBot listo!");
  presence();
});

//Eventos que capta el bot (basicamente sus comandos)
client.on("message", (msj) => {
    
    ///Comando !hola
    if ( msj.content === "!hola" ) {
        const embed = new Discord.MessageEmbed()
        
        .setAuthor( client.user.username, client.user.avatarURL() )
        .setColor(0xADFF2F)
        .setTitle( '¡Hola! :wave: Soy **CulhuaBot**' )
        .setDescription( 'Mi objetivo es administrar el Club :loudspeaker: y contestar preguntas frecuentes :question::thinking:' )
        .addField( '!Conoce mis comandos :robot: disponibles!', 'Escribe ***!comandos***' )
        .addField( '** **', 'Estoy en constante actualización, así que ¡Date una vuelta más seguido! :wink:' )
        .setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/08/wp-1629439235122.gif' )
        .setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
        msj.channel.send( embed );
    }else
    //Comando !comandos
    if ( msj.content === "!comandos" ) {
        const embed = new Discord.MessageEmbed()
        
        .setAuthor( client.user.username, client.user.avatarURL() )
        .setColor(0xADFF2F)
        .setTitle( 'Lista de comandos' )
        .setDescription( 'Aquí está una lista de las cosas que puedes hacer\n' )
        .addField( "📖Compartir cupones de cursos", "Escribe **!cupon** para saber cómo\n" )
        .addField( "📘Publicar el enlace a un libro", "Escribe **!libro** para saber cómo\n" )
        .addField( "👨‍🏫Invitar al Club a tu curso", "Escribe **!invitacion** para saber cómo\n" )
        .addField( "📹Compartir una clase grabada de tu curso", "Escribe **!clase** para saber cómo\n" )
        .addField( "🏆Publicar convocatorias de concursos", "Escribe **!anuncio** para saber cómo\n" )
        .addField( "🎆Compartir un evento fuera del Club", "Escribe **!evento** para saber cómo\n" )
        .addField( "🏫Adjuntar comunicados de la escuela", "Escribe **!escuela** para saber cómo\n" )
        .addField( "👎☹️¿Lo que necesitas hacer no está aquí?", "Escríbelo en <#865658571244568626>\n" )
        .setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/08/wp-1629439235122.gif' )
        .setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
        msj.channel.send( embed );
        
        msj.delete();
    }else
    //Enlace a libro
    if( msj.content.startsWith( "!libro" ) ) {
        let men = msj.content.slice(6);
        if( men.startsWith( ' ' ) ) 
		    {
            men = men.slice(1);
        }
        
        if( men.startsWith( "{link}" ) ) 
		{
			men = men.slice(6);		//Se salta el comando {link}
    	if( men.startsWith(' ') ) //Se salta el posible espacio
    	  men = men.slice(1);
			
      //Captura el link al libro
      var link;
      var i = 0;
      link = men[0];
      i++;
      while( i<men.length && men[i+1] != '{' )
      {
        link += men[i++];
      }
      men = men.slice(i+1);

      //Estas líneas asumen que el comando {titulo} estará presente y lo saltan
			men = men.slice(8);
			if( men.startsWith( ' ' ) )
				men = men.slice(1);

			//Comienza a capturar el titulo
			var title = "**Libro**: ";
			i = 0;
			while( i<men.length && men[i+1] != '{' ) 
			{
				title += men[i++];	
			}
			men = men.slice(i+1);

			//Estas líneas asumen que el comando {autor} estará presente y lo saltan
			men = men.slice(7);
			if( men.startsWith( ' ' ) )
				men = men.slice(1);

			//Comienza a capturar el autor
			var desc;
			i = 0;
			desc = "**Autor**: ";
			while( i<men.length && men[i+1] != '{' )
			{
				desc += men[i++];
			}
			desc += '\n';
			men = men.slice(i+1);

			//Estas líneas asumen que el comando {edicion} estará presente y lo saltan
			men = men.slice(9);
			if( men.startsWith( ' ' ) )
				men = men.slice(1);

			//Comienza a capturar la edición
			i = 0;
			desc += "**Edición**: "
			while( i<men.length && men[i+1] != '{' )
			{
				desc += men[i++];
			}
			desc += '\n';
			men = men.slice(i+1);

			//Estas líneas asumen que el comando {editorial} estará presente y lo saltan
			men = men.slice(11);
			if( men.startsWith( ' ' ) )
				men = men.slice(1);

			//Comienza a capturar la editorial
			i = 0;
			desc += "**Editorial**: ";
			while( i<men.length && men[i+1] != '{' )
			{
				desc += men[i++];
			}
      men = men.slice(i+1);

      //Estas líneas asumen que el comando {portada} estará presente y lo saltan
			men = men.slice(9);
			if( men.startsWith( ' ' ) )
				men = men.slice(1);

      //Comienza a capturar el link de la portada
      var portada;
      i = 0;
      portada = men[0];
      i++;
			while( i<men.length && men[i+1] != '{' )
			{
				portada += men[i++];
			}
      desc += '\n';
      men = men.slice(i+1);

      desc += '\n';
      desc += "**Descárgalo aquí (también puedes hacerlo dando click al título de este mensaje)**: "+link;

			//Ya procesado, se envia el mensaje
			const embed = new Discord.MessageEmbed()

      .setAuthor( client.user.username, client.user.avatarURL() )
      .setColor(0xADFF2F)
      .setURL( link )
			.setTitle( title )
			.setDescription( desc )
      .setImage( portada )
      .setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/08/wp-1629439235122.gif' )
      .setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )

			client.channels.resolve( "864918094585528370" ).send( embed )

      .then( msg => {
                msg.react( "🤩" )
                msg.react( "😲" )
                msg.react( "💯" )
                msg.react( "✅" )
            });
		}
		else //El usuario quiere saber como utilizar el comando libro
		{
            const embed = new Discord.MessageEmbed()
            
            .setAuthor( client.user.username, client.user.avatarURL() )
            .setColor(0xADFF2F)
            .setTitle( "¿Cómo compartir un libro con la comunidad?" )
            .setDescription( "Todos los comandos deben ir **en un solo mensaje** y en el orden en que se listan, para evitar errores" )
			      .addField( "Copia esta plantilla en tu mensaje, e ingresa los datos como se indica", "!libro {link} La URL al libro {titulo} El titulo de tu libro {autor} El autor del libro {edicion} la edicion del libro {editorial} la editorial del libro {portada} La URL de la portada del libro" )
            .setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/08/wp-1629439235122.gif' )
            .setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )

			      msj.channel.send( embed );	//Envia el mensaje en el mismo canal que se invocó
        }
        
        msj.delete();
    }else
    //Invitar a Platica
    if( msj.content.startsWith( "!charla") ) {
			let men = msj.content.slice(7);
			
			//Salta el espacio entre el comando principal y los demas
			if( men.startsWith( ' ') ) {
				men = men.slice(1);
			}
		
		//Contendran la informacion
    	var title = "**Charla**: ";
    	var cuando;
    	var tema;
    	var subtema;
    	var img;
    	var x = 0;
    	var n = 0;
    	var i;
    	
    	//Tiene titulo
    	if( men.startsWith( "{titulo}" ) ) {
    	   men = men.slice(8);
    	  if( men.startsWith(' ') ) {
    	    men = men.slice(1);
    	  }
    	  
			i = 0;
			while( i<men.length && men[i+1] != '{' ) {
				title += men[i++];	
			}
		}
		men = men.slice(i+1);
		
		//Cuando será
		if( men.startsWith( "{cuando}" ) ) {
		  men = men.slice(8);
		  if( men.startsWith( ' ' ) ) {
		    men = men.slice(1);
		  }
		  
		  if( men.startsWith( "-dia" ) ) {
		    men = men.slice(4);
		    if( men.startsWith( ' ' ) ) {
		      men = men.slice(1);
		    }
		    
		    var dia = men[0];
		    var k = 1;
		    while( men[k+1] != '-' ) {
		      dia += men[k++];
		    }
		    men = men.slice(k+1);
		  }
		  
		  if( men.startsWith( "-hora" ) ) {
		    men = men.slice(5);
		    if( men.startsWith( ' ' ) ) {
		      men = men.slice(1);
		    }
		    var hora = men[0];
		    k = 1;
		    while( men[k+1] != '{' ) {
		      hora += men[k++];
		    }
		    men = men.slice(k+1);
		  }
		  
		    cuando = "📆Día: "+dia+'\n'+"⌚Hora: "+hora+'\n'+"📢Canal: "+"<#877981330636439642>";
			
		}
		
		
		//Tiene tema (o temas )
		while( men.startsWith( "{tema}" ) ) {
			men = men.slice(6);
			if( men.startsWith( ' ' ) ) {
			  men = men.slice(1);
			}
			
			//Saca el tema
      if( n == 0 ) {
			tema = men[0];
			i = 1;
      }
      else {
        i = 0;
      }
			while( i<men.length && men[i] != '&' ) {
				tema += men[i++];
			}
			tema += '@';
			i++;
			
			men = men.slice(i);
			
			//Saca el subtema
      if( n == 0 ) {
      subtema = men[0];
      i = 1;
      }
      else {
        i = 0;
      }
			while( i<men.length && men[i+1] != '{' ) {
				subtema += men[i++];
			}
			subtema += '@';
			
			n++;
			men = men.slice(i+1);
		}
		
		//Agrega la imagen
		if( men.startsWith( "{imagen}" ) ) {
		  men = men.slice(8);
		  if( men.startsWith( ' ' ) ) {
		    men = men.slice(1);
		  }
		  
		  img = men[0];
		  i = 1;
		  while( i<men.length ) {
		    img += men[i++];
		  }
		}
    	
    	const embed = new Discord.MessageEmbed()
    	
    	.setColor( 0x8A2BE2 )
    	.setAuthor( client.user.username, client.user.avatarURL() )  
    	.setTitle( title )
    	.setDescription( cuando );
    	while( x++ < n ) {
    		var tema_1;
    		var subtema_1;
    		
    		tema_1 = tema[0];
    		var p1 = 1;
    		
    		subtema_1 = subtema[0];
    		var p2 = 1;
    		
    		while( tema[p1] != '@' ) {
    			tema_1 += tema[p1++];
			}
			tema = tema.slice(p1+1);
			
			while( subtema[p2] != '@' ) {
				subtema_1 += subtema[p2++];
			}
			subtema = subtema.slice(p2+1);
			
    		embed.addField( tema_1, subtema_1 );
    	}
    	
    	embed.setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/08/wp-1629439235122.gif' )
    	.setImage( img )
    	.setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
    	
    	client.channels.resolve("865036876024905728").send( embed )
    	
    	.then( msg => {
                msg.react( "🤩" )
                msg.react( "😲" )
                msg.react( "💯" )
                msg.react( "✅" )
            });
            
      msj.delete();
	}/*
    else
    //Invitar a Curso
    if( msj.content.startsWith( "!curso" ) ) {
    }else
    //Compartir clase grabada
    if( ) {
    }else
    //Convocatorias de Concursos
    if( ) {
    }*/else
    //Eventos fuera del Club
    if( msj.content.startsWith( "!evento") ) {
    			let men = msj.content.slice(7);
			
			//Salta el espacio entre el comando principal y los demas
			if( men.startsWith( ' ' ) ) {
				men = men.slice(1);
			}
		
		//Contendran la informacion
    	var title = "**Evento**: ";
    	var desc;
    	var hora = "Todo el día";
    	var texto;
    	var tema;
    	var subtema;
    	var img;
    	var x = 0;
    	var k = -1;
    	var n = 0;
    	var i;
    	
    	//Tiene titulo
    	if( men.startsWith( "{titulo}" ) ) {
    	   men = men.slice(8);
    	  if( men.startsWith(' ') ) {
    	    men = men.slice(1);
    	  }
    	  
			i = 0;
			while( i<men.length && men[i+1] != '{' ) {
				title += men[i++];	
			}
		}
		men = men.slice(i+1);
		
		//Cuando será
		if( men.startsWith( "{descripcion}" ) ) {
		  men = men.slice(13);
		  if( men.startsWith( ' ' ) ) {
		    men = men.slice(1);
		  }
		  if( men.startsWith( "-dia" ) ) {
		    men = men.slice(4);
		    if( men.startsWith( ' ' ) ) {
		      men = men.slice(1);
		    }
		    
		    var dia = men[0];
		    k = 1;
		    while( men[k+1] != '-' ) {
		      dia += men[k++];
		    }
		    men = men.slice(k+1);
		  }
		  console.log( men );
		  
		  if( men.startsWith( "-hora" ) ) {
		    men = men.slice(5);
		    if( men.startsWith( ' ' ) ) {
		      men = men.slice(1);
		    }
		    
		    hora = men[0];
		    k = 1;
			while( men[k+1] != '&' ) {
		      hora += men[k++];
		    }
		    men = men.slice(k+1);
		  }
		  
		  	men = men.slice(1);
		  	if(men.startsWith( ' ' ) ) {
			  	men = men.slice(1);
			  }
		  	texto = men[0];
		  	k = 1;
		  	while( men[k+1] != '{' ) {
			  	texto += men[k++];
			  }
			  men = men.slice(k+1);
		  
		    desc = "📆Día: "+dia+'\n'+"⌚Hora: "+hora+"\n\n"+texto;
			
		}
		
		
		//Tiene tema (o temas )
		while( men.startsWith( "{tema}" ) ) {
			men = men.slice(6);
			if( men.startsWith( ' ' ) ) {
			  men = men.slice(1);
			}
			
			//Saca el tema
      if( n == 0 ) {
			tema = men[0];
			i = 1;
      }
      else {
        i = 0;
      }
			while( i<men.length && men[i] != '&' ) {
				tema += men[i++];
			}
			tema += '@';
			i++;
			
			men = men.slice(i);
			
			//Saca el subtema
      if( n == 0 ) {
      subtema = men[0];
      i = 1;
      }
      else {
        i = 0;
      }
			while( i<men.length && men[i+1] != '{' ) {
				subtema += men[i++];
			}
			subtema += '@';
			
			n++;
			men = men.slice(i+1);
		}
		
		//Agrega la imagen
		if( men.startsWith( "{imagen}" ) ) {
		  men = men.slice(8);
		  if( men.startsWith( ' ' ) ) {
		    men = men.slice(1);
		  }
		  
		  img = men[0];
		  i = 1;
		  while( i<men.length ) {
		    img += men[i++];
		  }
		}
    	
    	const embed = new Discord.MessageEmbed()
    	
    	.setColor( 0x4682B4 )
    	.setAuthor( client.user.username, client.user.avatarURL() )  
    	.setTitle( title )
    	.setDescription( desc );
    	while( x++ < n ) {
    		var tema_1;
    		var subtema_1;
    		
    		tema_1 = tema[0];
    		var p1 = 1;
    		
    		subtema_1 = subtema[0];
    		var p2 = 1;
    		
    		while( tema[p1] != '@' ) {
    			tema_1 += tema[p1++];
			}
			tema = tema.slice(p1+1);
			
			while( subtema[p2] != '@' ) {
				subtema_1 += subtema[p2++];
			}
			subtema = subtema.slice(p2+1);
			
    		embed.addField( tema_1, subtema_1 );
    	}
    	
    	embed.setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/08/wp-1629439235122.gif' )
    	.setImage( img )
    	.setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
    	
    	//msj.channel.send(embed)
    	client.channels.resolve( "873087905655058442" ).send( embed )
    	.then( msg => {
                msg.react( "🤩" )
                msg.react( "🥳" )
                msg.react( "💯" )
                msg.react( "🤓" )
                msg.react( "✅" )
            });
            
      msj.delete();
    }/*else
    //Comunicados de la Escuela
    if( ) {
    }*/else
    ///Cupones de cursos
    if( msj.content.startsWith( "!cupon" ) ) {
        ///Se desea agregar un cupon
        let link = msj.content.slice(6);
        if( link.startsWith( ' ' ) ) {
            link = link.slice(1);
        }
        
        ///El cupon es de Udemy
        if( link.startsWith( "udemy" ) ) {
            link = link.slice(5);
            if( link.startsWith( ' ' ) ) {
                link = link.slice(1);
            }
            
            client.channels.resolve("864652177691377724").send(link);
        }else
        if( link.startsWith( "coursera" ) ) {
            link = link.slice(8);
            if( link.startsWith( ' ' ) ) {
                link = link.slice(1);
            }
            
            client.channels.resolve("864652372248756225").send(link);
        }else
        if( link.startsWith( "edx" ) ) {
            link = link.slice(3);
            if( link.startsWith( ' ' ) ) {
                link = link.slice(1);
            }
            
            client.channels.resolve("864652499414417479").send(link);
        }else
        if( link.startsWith( "tutellus" ) ) {
            link = link.slice(8);
            if( link.startsWith( ' ' ) ) {
                link = link.slice(1);
            }
            
            client.channels.resolve("864652428704350238").send(link);
        }else
        if( link.startsWith( "edutin" ) ) {
            link = link.slice(6);
            if( link.startsWith( ' ' ) ) {
                link = link.slice(1);
            }
            
            client.channels.resolve("870821718002892820").send(link);
        }
        
        msj.delete();
        
    }else
    if( msj.content.startsWith( "!clase" ) ) {
    
        let video = msj.content.slice(6);
        
        if( video.startsWith( ' ' ) ) {
            video = video.slice(1);
        }
        
        if( video.startsWith( "frontend" ) ) {
            
            video = video.slice( 8 );
            
            if( video.startsWith( ' ' ) ) {
                video = video.slice( 1 );
            }
            const embed = new Discord.MessageEmbed()
        
            .setAuthor( client.user.username, client.user.avatarURL() )  
            .setColor( 0xFF5733 )
            .setTitle( "Curso del Club: **Frontend con HTML5 y CSS3**" )
            .setDescription ("***¡Club! Se ha publicado una nueva clase***")
            .addField( "**Da click aquí para verla:**", video.content )
            .setURL( video.content )
            .setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
            .setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
        
            msj.channel.send( embed )
              .then( msg => {
                msg.react( "🤩" )
                msg.react( "😲" )
                msg.react( "💯" )
                msg.react( "✅" )
            });
        
            //msj.delete();
        }
    }else
    if( msj.content.startsWith( "!mensaje") ) {
    	let men = msj.content.slice(8);
    	
    	if( men.startsWith( ' ' ) ) {
    	  men = men.slice(1);
    	}
    	
    	men = men.slice(2);
    	
    	//Canal
    	var canal = men[0];
    	var i = 1;
    	
    	while( men[i] != '>')
    	{
    	   canal += men[i++];
    	}
    	men = men.slice(i+1);
    	
    	if( men.startsWith( ' ' ) ) {
    	  men = men.slice(1);
    	}
    	
    	//Titulo
    	var titulo = men[0];
    	i = 1;
    	
    	while( men[i] != '&' ) {
    	  titulo += men[i++];
    	}
    	men = men.slice(i+1);
    	
    	const embed = new Discord.MessageEmbed()
    	
    	.setAuthor( client.user.username, client.user.avatarURL() )  
    	.setTitle( titulo )
    	.setDescription( men );
    	
    	embed.setThumbnail( 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
    	.setFooter( 'Club de Algoritmia ESIME Culhuacán', 'https://davideisenbergnicolas2001home.files.wordpress.com/2021/07/214109906_112706811084920_1598247486373550305_n-1.png' )
    	
    	client.channels.resolve( canal ).send( embed )
      .then( msg =>  {
        msg.react( '🤩' )
        msg.react( '🥳' )
        msg.react( '😎' )
      });
    }
    
});

//Acceso al bot
client.login(mySecret); 