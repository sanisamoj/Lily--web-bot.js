const path = require('path')
import puppeteer from 'puppeteer'
import WAWebJS, { MessageMedia, Client } from 'whatsapp-web.js'
const qrcode = require('qrcode-terminal')
import { servicos } from './newsServices'

const services: any = servicos
var cadeiaGrupos: any = [{ grupo: "indefinido", possible: 3, chat: 'null' }]

async function Lily() {
    try {
        //Login via cache
        const { Client, LocalAuth } = require('whatsapp-web.js');
        const client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] }

        });
        
        client.on('qr', (qr : any) => {
            qrcode.generate(qr, {small: true});
        });

        client.on('ready', () => {
            console.log('Cliente está pronto!')

            //Função para pegar horário
            function Hours() {
                let hr : any = new Date()
                let hrFormated : string = hr.toLocaleTimeString('pt-BR')
                return hrFormated.slice(0, 2)               
            }            
            
        });

        client.initialize();

        //Evento quando um usuário entra no grupo
        client.on('group_join', async (response: any) => {
            let chat: WAWebJS.Chat = await response.getChat()
            chat.sendMessage(`*Oie, qualquer coisa só digitar* *_/comandos ou me chamar._*`)
            
        })
        //evento para quando o usuário sai do grupo
        client.on('group_leave', async (response: any) => {
            let chat: WAWebJS.Chat = await response.getChat()
            const msgGrouLeave = ['Vai com deus!', 'vai e não volta hein', 'tchau!']
            chat.sendMessage(msgGrouLeave[Math.floor(Math.random() * msgGrouLeave.length)])
            
        })

        //EventLister quando recebe mensagens
        client.on('message', async (message: any) => {
            const chatP: any = await message.getChat()
            const isGroup: number = message.from.search('@g')
            let thisGroup : any

            //função para enviar mensagens apenas para "chats on"
            async function sendToChatsV2(m : string){
                const mychats: any = await client.getChats();
                for (let chat of mychats) {
                    cadeiaGrupos.map((item: any) => {
                        if (item.chat == 'on' && item.grupo == chat.id.user) {
                            chat.sendMessage(m)
                        } else {return}
                    })                    
                }
            }

            //função para mandar mensagens para todos os contatos e grupos
            async function sendToChats(m : string){
                const mychats = await client.getChats();
                for(let chat of mychats){
                    chat.sendMessage(m);
                }
            }

       
            try {
                                //Identifica se as mensagens são de grupo ou não.
                if (isGroup != -1) {

                    //Controle de grupos-----------------------------------------

                    //Retorna o grupo
                    async function retornoGrupo() {
                        const controleChat: any = await message.getChat()
                        let groupMetaData: String = controleChat['groupMetadata']['id']['user']
                        let valueReturned : any
                        const found = cadeiaGrupos.find( (element : any) => {
                            return element.grupo === groupMetaData
                        })
                        if (found) {
                            valueReturned = `GroupId : ${found.grupo}\nValor de possibilidade: ${found.possible} | Chat : ${found.chat}`
                        }

                        return valueReturned
                    }

                    thisGroup = await retornoGrupo()
                        
                    //Função para retornar o valor de cada grupo
                    async function DataControlSet() {
                        const controleChat: any = await message.getChat()
                        let groupMetaData: String = controleChat['groupMetadata']['id']['user']
                        let valueReturned : number = 2
                        const found = cadeiaGrupos.find( (element : any) => {
                            return element.grupo === groupMetaData
                        })
                        if (found) {
                            valueReturned = found.possible
                        }

                        return valueReturned
                    }

                    //Coloca o valor escolhido no possible do grupo atual
                    async function SetControl_possible(arg? : number) {
                        const controleChat: any = await message.getChat()
                        let valuePossible: number = arg || 1
                        let groupMetaData: String = controleChat['groupMetadata']['id']['user']
                        for (let i = 0; i < cadeiaGrupos.length; i++) {
                            if (groupMetaData == cadeiaGrupos[i].grupo) {
                                cadeiaGrupos[i].possible = valuePossible
                            } 
                        }
                        return 
                    }

                    //Coloca o valor escolhido no possible do grupo atual (chat)
                    async function SetControl_possibleChat(arg? : string) {
                        const controleChat: any = await message.getChat()
                        let argumento : string = arg?.toLowerCase() || ""
                        let valuePossible: string 
                        if (argumento == "") {
                            valuePossible = 'on'
                        } else if (argumento == 'on' || argumento == 'off') {
                            valuePossible = argumento
                        } else {
                            valuePossible = 'undefined'
                        }
                        
                        let groupMetaData: String = controleChat['groupMetadata']['id']['user']
                        for (let i = 0; i < cadeiaGrupos.length; i++) {
                            if (groupMetaData == cadeiaGrupos[i].grupo) {
                                cadeiaGrupos[i].chat = valuePossible
                            } 
                        }
                        return 
                    }
                    
                    //função que adiciona o grupo a cadeiasGrupos caso ele não exista       
                    async function DataGroupPush() {
                        const controleChat: any = await message.getChat()
                        let groupMetaData: String = controleChat['groupMetadata']['id']['user']
                        const found : any = cadeiaGrupos.find((element: any) => {
                            return element.grupo === groupMetaData
                        })
                        if (found == undefined) {
                            let valuePossible: any = await DataControlSet()
                            const SetGroup : any = { grupo: groupMetaData, possible: valuePossible, chat : 'off' }
                            cadeiaGrupos.push(SetGroup)                        
                        }            
                        return 
                    }
                        
                    //declarações
                    DataGroupPush()
                    var valueThisGroup = await DataControlSet()
                    var possibleMsg : number = valueThisGroup
                    const possibleMsgSticker : number = 2
                    const sticker : any = MessageMedia.fromFilePath(path.join(__dirname, "/stickers" + services.sendSticker()))
                    const possibilidadeSticker : number = Math.floor(Math.random() * possibleMsgSticker)
                    const result : number = Math.floor(Math.random() * possibleMsg)
                    const respostaAuto: any = await services.analiseDeContexto(message.body)
                    const chat: WAWebJS.Chat = await message.getChat()
                    
                    let msgSemAcento : string = message.body.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase() //Mensagem sem acento para /notícias
                    let resultadoCep: String = "" 
                                                
                    //Retorno de mensagem para controle
                    const bodyMessage : any = {
                        autor: `${message.author}`,
                        isGroup: `${message.from}`,
                        message: `${message.body}`,
                        hours: `${Date()}`
                    }

                    //Quando recebe LILY
                    let mensagemNormlized : string = message.body.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase().replaceAll(" ", "")
                    if (mensagemNormlized.search("LILY") != -1 && mensagemNormlized.search('/') == -1) {
                        const arrayMensagemLily = ['Qualquer coisa só digitar */comandos*', 'Oi?', 'oq?',
                            'Posso te ajudar? Só digitar */comandos*', 'Fala ai', 'digita *_/comandos_* ai pow',
                        ]

                        let resultado : string = arrayMensagemLily[Math.floor(Math.random() * arrayMensagemLily.length)]
                        message.reply(resultado)
                                            
                    } else if (mensagemNormlized.search("LILY") != -1 && mensagemNormlized.search('/') != -1) {
                        const arrayMensagemLily = ['Qualquer coisa só digitar */comandos*', 'Posso te ajudar? Só digitar */comandos*',
                            'e ajudo mais digitando */comandos*', 'digita *_/comandos_* ai pow',
                        ]

                        let resultado : string = arrayMensagemLily[Math.floor(Math.random() * arrayMensagemLily.length)]
                        message.reply(resultado)
                    }

                    //Controle de possibilidade in Wpp como admin 
                    if ((message.body.slice(0, 9) == '/possible')) {
                        let msgAnormlized: number = parseInt(message.body.slice(9).replaceAll(" ", "")) || 3
                        var yAdmin : boolean = false
                        chatP.participants.map((data: any) => {
                            if (data.isAdmin == true && message.author.search(data.id.user) != -1) {
                                message.reply('*Configurações alteradas*')
                                SetControl_possible(msgAnormlized)
                                yAdmin = true
                                    
                            }           
                        })

                        if (yAdmin == false) {
                                message.reply("*Você não é admin para alterar isso!*")
                            }

                    }
                    
                    //Controle de possibilidade in Wpp como admin -------- enviar mensagens sem ngm requisitar
                    if ((message.body.slice(0, 5) == '/chat')) {
                        let msgAnormlized: string = message.body.slice(5).replaceAll(" ", "")
                        var yAdmin : boolean = false
                        chatP.participants.map((data: any) => {
                            if (data.isAdmin == true && message.author.search(data.id.user) != -1) {
                                message.reply('*Configurações alteradas*')
                                SetControl_possibleChat(msgAnormlized)
                                yAdmin = true
                                    
                            }           
                        })

                        if (yAdmin == false) {
                                message.reply("*Você não é admin para alterar isso!*")
                            }

                    }

                    //Ver informações do grupo atual
                    if ((message.body.slice(0, 6) == '/group')) {
                        var yAdmin : boolean = false
                        chatP.participants.map((data: any) => {
                            if (data.isAdmin == true && message.author.search(data.id.user) != -1) {                              
                                message.reply(thisGroup)
                                yAdmin = true
                                    
                            }           
                        })

                        if (yAdmin == false) {
                                message.reply("*Você não é admin para alterar isso!*")
                            }

                    }

                    //Controle de possibilidade in Wpp como admin -------- enviar mensagens sem ngm requisitar
                    
                        
                    //Aqui faz as verificações e possibilidades de respostas
                    if (result == 0) {
                            switch (true) {
                                case message.hasMedia == false && respostaAuto['envio'] == true :
                                    chat.sendMessage(`${respostaAuto['mensagem']}`)
                                    break
                                case message.hasMedia == true && possibilidadeSticker == 0:
                                    const resultMidia : any = await services.analiseDeContexto('MIDIA')
                                    message.reply(`${resultMidia['mensagem']}`)
                                    break
                                case message.hasMedia == true && possibilidadeSticker != 0:
                                    chat.sendMessage(sticker, { sendMediaAsSticker: true })
                                    break
                                case respostaAuto['envio'] == false:
                                    //case para uso especial
                                    break
                                default:
                                    console.log('Erro : Não passou in case')
                            }
                    }
                        
                        
        //---------------------------------------------Comandos---------------------------------------------------------
                    
                    let msgf: any = message.body.toUpperCase()
                    let msgFormatada: String = msgf.replaceAll(" ", "")
                    let boasVindas : string = 'Oiee, sou a *-- Lily --* serei a nova companheira do grupo de vocês\n\n\
Eu posso por enquanto marcar todos do grupo, realizar um sorteio e marcar uma pessoa aleatóriamente, posso também animar o grupo quando estiver muito silencioso, posso contar algumas piadas, notícias e ainda interagir com algumas mensagens.\n\n\
Para ver o que eu posso fazer você pode me chamar digitando meu *nome*, ou */Comandos*\n\n\
*Palavras chaves até o momento:* _Sair, risadas(kkk) Quero, Legal, Otimo, Sim, Acho, Verdade, Vamos, links, Clima, Melhor, Concordo, Vou, Vai, Vamo, Pix, Compro, Recebi, Comprei, Paguei, Dinheiro, Caro_'
                    let comandos : string = '*_Meus comandos por enquanto são:_*\n\n\
*/Lily* - _Aqui você me chama_\n\
*/Comandos* - _Aqui eu te mostro meus Comandos_\n\
*/Todos* - Aqui eu marco todos os usuários do Grupo_\n\
*/Boasvindas* - _Aqui eu me apresento para o Grupo_ :)\n\
*/Sorteio* - _Aqui eu sorteio ou escolho aleatoriamente algum usuário do grupo e marco ele_\n\
*/Noticias* - _Aqui eu mostro uma noticia simples para você_ ex: */Notícias Política*\n\
*/Cep* - _Aqui eu te retorno o cep pesquisado_ ex: */cep 04163050*\n\
*/Climas* - _Retorno o clima dos próximos 6 dias_\n\
*/possible* - _Aqui é controlado a frequência de respostas (Apenas admin)_'
                    
                    
                            
                    switch (true) {

                                //Comando /boasvindas --- Retorna a apresentação da Lily
                        case msgFormatada === '/BOASVINDAS':
                            chat.sendMessage(boasVindas)
                            break
                        //Comando /todos --- Retorna uma menção de todos os usuários do grupo.
                        case msgf === '/TODOS':
                            let text : any = "";
                            let mentions : any = [];

                            for (let participant of chatP.participants) {
                                const contact : any = await client.getContactById(participant.id._serialized);

                                mentions.push(contact);
                                text += `@${participant.id.user}`;
                            }

                            await chat.sendMessage(text, {mentions});
                            break
                        case msgf === '/COMANDOS':                   
                            message.reply(comandos)
                            break
                        //Comando /Sorteio --- Retorna um  usuário aleatoriamente
                        case msgf === '/SORTEIO':
                            const array : any = chatP.participants
                            let qnt : number = await array.length
                            let valorSorteado : number = Math.floor(Math.random() * qnt)
                            let contato: any = await array[valorSorteado]
                            while(contato.id.user == "5511953082616") {
                                return contato = await array[Math.floor(Math.random() * qnt)]
                            }
                            let serialized : any = await client.getContactById(contato.id._serialized)
                            chat.sendMessage("Estou sorteando....")
                            setTimeout(async () => {
                                await chat.sendMessage(`Não teve pra onde correr, foi você @${contato.id.user}`, {
                                    mentions: [serialized]
                                })
                            }, 1500)
                            break
                        //Retorna o clima quando alguém envia clima
                        case msgf.search('CLIMA') != -1 && msgf.search('/') == -1: //código para ser revisto, apenas mostra o clima do sp
                            const clima = await services.apiClima()
                            message.reply(clima)
                            break
                        case msgf.slice(0,7) == "/CLIMAS" :                      
                            const apiClima : any = await servicos.apiClimaAllDays(msgf)
                            message.reply(apiClima)
                            break
                        //Comando  /Noticias --- Retorna aletoriamente noticias
                        case msgSemAcento.slice(0, 9) === "/NOTICIAS":
                            try {
                                let apiNews : any = await services.apiNews(message.body.slice(10))
                                if (apiNews.linkImg == null) {
                                    await chat.sendMessage(apiNews.txt)
                                } else {
                                    const media : any = await MessageMedia.fromUrl(apiNews.linkImg);
                                    await chat.sendMessage(media, {caption: apiNews.txt})
                                }          
                            } catch (erro) {
                                message.reply("*_Sorry, os servidores das fontes estão meio lentos, tenta mais uma vez pf._*")
                            }                                 
                            break
                        //Comando /Cep --- Retorna o cep pesquisado
                        case msgf.slice(0, 4) == '/CEP':  
                            const cepPesquisado : string = msgf.slice(4).replaceAll(" ", "")
                            if (cepPesquisado.slice(4) == '' || cepPesquisado.slice(4).search('-') != -1 ) {
                                    message.reply("Percebi algo diferente, tenta assim: */Cep 04163050*")
                            } else {
                                resultadoCep = await services.cep(cepPesquisado)
                                message.reply(resultadoCep)
                            }
                            break
                        default:
                            break
                    }

                } else {// Código para mensagens enviadas no pv

                    if (message.id.remote.slice(0, 13) != '5511998342464') {
                        let msgInPv = "Meu criador não permite mais que eu mande mensagem no pv :(\n\nChama ele no pv - https://wa.me/5511998342464"
                        message.reply(msgInPv)

                    } else {
                        switch (true) {
                            case message.body.slice(0, 8) == '/talkAll':                                   
                                let msgTalkAll: string = message.body.slice(9)
                                message.reply(`_Vou enviar sua mensagem para todos os usuários._\n_msg :_ ${msgTalkAll}`)
                                sendToChats(msgTalkAll) 
                                break
                            case message.body.slice(0, 5) == '/talk':
                                let msgTalk: string = message.body.slice(6)
                                message.reply(`_Vou enviar sua mensagem para os grupos com o CHAT-ON._\n_msg :_ *${msgTalk}*`)
                                sendToChatsV2(msgTalk)
                                break                             
                            default:
                                message.reply("Não entendi esse comando-admin")
                        }
                    }
                                   
                }
            } catch (e) {
                return
            }
        })
    // Caso a Lily venha apresentar erros, ela é desligada em outro arquivo com LyOn == false
    } catch (e) {
        console.log(e)
    }
        
            
            
}


export {Lily}