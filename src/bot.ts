import { Client, LocalAuth, Message, MessageMedia } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';
import { servicos } from './newsServices'
import path from 'path'

const services = servicos
let cadeiaGrupos = [{ grupo: "indefinido", possible: 3, chat: 'null' }]

//função para enviar mensagens apenas para "chats on"
async function sendToChatsV2(msg: string, clientWpp : Client) {
    const myChats = await clientWpp.getChats();
    for (let chat of myChats) {
        cadeiaGrupos.map((item: any) => {
            if (item.chat == 'on' && item.grupo == chat.id.user) {
                chat.sendMessage(msg)
            } else { return }
        })
    }
}

//função para mandar mensagens para todos os contatos e grupos
async function sendToChats(msg: string, clientWpp : Client) {
    const mychats = await clientWpp.getChats();
    for (let chat of mychats) {
        chat.sendMessage(msg);
    }
}

//Retorna o grupo com opções
async function retornoGrupo(chat : any) {
    const controleChat: any = chat
    const groupMetaData: String = controleChat['groupMetadata']['id']['user']
    let valueReturned: string = ''
    const found = cadeiaGrupos.find((element: any) => {
        return element.grupo === groupMetaData
    })
    if (found) {
        valueReturned = `GroupId : ${found.grupo}\nValor de possibilidade: ${found.possible} | Chat : ${found.chat}`
    }

    return valueReturned
}

//Função para retornar o valor possible de cada grupo
async function DataControlSet(chat: any) {
    const controleChat: any = chat
    const groupMetaData: String = controleChat['groupMetadata']['id']['user']
    let valueReturned: number = 2
    const found = cadeiaGrupos.find((element: any) => {
        return element.grupo === groupMetaData
    })
    if (found) {
        valueReturned = found.possible
    }

    return valueReturned
}

//Coloca o valor escolhido no possible do grupo atual
async function SetControl_possible(chat: any, arg : number = 1) {
    const controleChat: any = chat
    const valuePossible: number = arg
    const groupMetaData: String = controleChat['groupMetadata']['id']['user']
    for (let i = 0; i < cadeiaGrupos.length; i++) {
        if (groupMetaData == cadeiaGrupos[i].grupo) {
            cadeiaGrupos[i].possible = valuePossible
        }
    }
    return
}

//Coloca o valor escolhido no possible do grupo atual (chat)
async function SetControl_possibleChat(chat: any, arg: string = 'on') {
    const controleChat: any = chat
    const argument: string = arg.toLowerCase()
    const valuePossible: string = argument       
    const groupMetaData: String = controleChat['groupMetadata']['id']['user']
    for (let i = 0; i < cadeiaGrupos.length; i++) {
        if (groupMetaData == cadeiaGrupos[i].grupo) {
            cadeiaGrupos[i].chat = valuePossible
        }
    }
    return
}

//função que adiciona o grupo a cadeiasGrupos caso ele não exista       
async function DataGroupPush(chat: any) {
    const controleChat : any = chat
    const groupMetaData : any = controleChat['groupMetadata']['id']['user']
    const found: any = cadeiaGrupos.find((element: any) => {
        return element.grupo === groupMetaData
    })
    if (found == undefined) {
        const valuePossible: any = await DataControlSet(chat)
        const SetGroup: any = { grupo: groupMetaData, possible: valuePossible, chat: 'off' }
        cadeiaGrupos.push(SetGroup)
    }
    return
}
//Função que formata o texto , para maiusculo, remove acentos e espaços
async function messageNormalized(messageBody : any) {
    const message_normalized: string = messageBody.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase().replaceAll(" ", "")
    return message_normalized
}

export class BotPrototype {
    client : Client
    qr_code! : string

    constructor() {
        this.client = new Client({
            puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
            authStrategy: new LocalAuth()
    });
    
        this.client.on('qr', qr => {
            qrcode.generate(qr, {small:true});
            console.log(qr)
        })
        
        this.client.on('ready', () => {
            console.log('Bot online!')
        });
        
        this.client.initialize();
        
        this.client.on('message', message => {
            if(message.body === '!ping') {
                message.reply('pong');
            }
        });

        this.client.on('message', async (message: Message) => {
            const chat : any = await message.getChat()
            const isGroup = message.from.search('@g')
            const message_normalized = await messageNormalized(message.body)
        
            if (isGroup !== -1) {
                await DataGroupPush(chat)
                const possibleThisGroup: number = await DataControlSet(chat)
                const possibleToSendMessage: number = Math.floor(Math.random() * possibleThisGroup)
                const possibleToSendSticker: number = Math.floor(Math.random() * 2)
                const respostaAuto: any = await services.analiseDeContexto(message_normalized)
                const resultMidia: any = await services.analiseDeContexto('MIDIA')
        
                switch (true) {
                    case message_normalized.search('LILY') != -1 && message_normalized.search('/') == -1: //Quando recebe /lily ou lily
                        const arrayMensagemLily: string[] = ['Qualquer coisa só digitar */comandos*', 'Oi?', 'oq?','Posso te ajudar? Só digitar */comandos*', 'Fala ai', 'digita *_/comandos_* ai pow']
                        const messageDrawn: string = arrayMensagemLily[Math.floor(Math.random() * arrayMensagemLily.length)]
                        try {
                            await message.reply(messageDrawn)
                        } catch (err) {
                            return
                        }
                        break
                    case message_normalized.search("LILY") != -1 && message_normalized.search('/') != -1:
                        const arrayMensagemLily2 = ['Qualquer coisa só digitar */comandos*', 'Posso te ajudar? Só digitar */comandos*', 'e ajudo mais digitando */comandos*', 'digita *_/comandos_* ai pow']
                        const messageDrawn2 : string = arrayMensagemLily2[Math.floor(Math.random() * arrayMensagemLily2.length)]
                        try {
                            await message.reply(messageDrawn2)
                        } catch (err) {
                            return
                        }
                        break
                    case message.body.slice(0, 9) == '/possible': //Controle de possibilidade in Wpp como admin 
                        const valuePossible: number = parseInt(message.body.slice(9).replaceAll(" ", "")) || 2
                            chat.participants.map(async (data: any) => {
                                if (data.isAdmin == true && message.author!.search(data.id.user) != -1) {
                                    SetControl_possible(chat, valuePossible)
                                    try {
                                        await message.reply('*Configurações alteradas 😜*')
                                    } catch (err) {
                                        return
                                    }
                                }           
                            })
                        break
                    case message.body.slice(0, 5) == '/chat': //Controle de possibilidade in Wpp como admin -------- enviar mensagens sem ngm requisitar
                        const valueChat: string = message.body.slice(5).replaceAll(" ", "")
                        chat.participants.map(async (data: any) => {
                            if (data.isAdmin == true && message.author!.search(data.id.user) != -1) {
                                SetControl_possibleChat(chat, valueChat)     
                                try {
                                    await message.reply('*Configurações alteradas*')
                                } catch (err) {
                                    return
                                }
                            }
                        })
                        break
                    case message.body.slice(0, 6) == '/group': //Ver informações do grupo atual
                        const thisGroup: string = await retornoGrupo(chat)
                        chat.participants.map(async (data: any) => {
                            if (data.isAdmin == true && message.author!.search(data.id.user) != -1) {                              
                                try { 
                                    await message.reply(thisGroup) 
                                } catch (err) {
                                    return
                                }                              
                            } 
                        })
                        break
                    case message_normalized == '/BOASVINDAS':
                        const boasVindas : string = 'Oiee, sou a *-- Lily --* serei a nova companheira do grupo de vocês\n\nEu posso por enquanto marcar todos do grupo, realizar um sorteio e marcar uma pessoa aleatóriamente, posso também animar o grupo quando estiver muito silencioso, posso contar algumas piadas, notícias e ainda interagir com algumas mensagens.\n\nPara ver o que eu posso fazer você pode me chamar digitando meu *nome*, ou */Comandos*\n\n*Palavras chaves até o momento:* _Sair, risadas(kkk) Quero, Legal, Otimo, Sim, Acho, Verdade, Vamos, links, Clima, Melhor, Concordo, Vou, Vai, Vamo, Pix, Compro, Recebi, Comprei, Paguei, Dinheiro, Caro_'
                        try {
                            chat.sendMessage(boasVindas)
                        } catch (err) {
                            return
                        }
                        break
                    case message_normalized === '/TODOS':
                        let text : any = "";
                        let mentions : any = [];
        
                        for (let participant of chat.participants) {
                            const contact : any = await this.client.getContactById(participant.id._serialized);
        
                            mentions.push(contact);
                            text += `@${participant.id.user}`;
                        }
        
                        try {
                            chat.sendMessage(text, {mentions});
                        } catch (err) {
                            console.log(err)
                        }
                        break
                    case message_normalized === '/COMANDOS':
                        let comandos : string = '*_Meus comandos por enquanto são:_*\n\n*/Lily* - _Aqui você me chama_\n*/Comandos* - _Aqui eu te mostro meus Comandos_\n*/Todos* - Aqui eu marco todos os usuários do Grupo_\n*/Boasvindas* - _Aqui eu me apresento para o Grupo_ :)\n*/Sorteio* - _Aqui eu sorteio ou escolho aleatoriamente algum usuário do grupo e marco ele_\n*/Noticias* - _Aqui eu mostro uma noticia simples para você_ ex: */Notícias Política*\n*/Cep* - _Aqui eu te retorno o cep pesquisado_ ex: */cep 04163050*\n*/Climas* - _Retorno o clima dos próximos 6 dias_\n*/possible* - _Aqui é controlado a frequência de respostas (Apenas admin)_'
                        try {
                            await message.reply(comandos)
                        } catch (err) {
                            return
                        }
                        break
                    case message_normalized == '/SORTEIO':
                        const array : any = chat.participants
                        let qnt : number = await array.length
                        let valorSorteado : number = Math.floor(Math.random() * qnt)
                        let contato: any = await array[valorSorteado]
                        while(contato.id.user == "5511953082616") {
                            return contato = await array[Math.floor(Math.random() * qnt)]
                        }
                        let serialized : any = await this.client.getContactById(contato.id._serialized)
                        chat.sendMessage("Estou sorteando....")
                        setTimeout(async () => {
                            try {
                                await chat.sendMessage(`Não teve pra onde correr, foi você @${contato.id.user}`, {
                                    mentions: [serialized]
                                })
                            } catch (err) {
                                return
                            }
                        }, 1500)
                        break
                    case message_normalized.search('CLIMA') != -1 && message_normalized.search('/') == -1:
                        const clima = await services.apiClima()
                        try {
                            await message.reply(clima)
                        } catch (err) {
                            return
                        }
                        break
                    case message_normalized.slice(0, 7) == '/CLIMAS':
                        const apiClima : any = await servicos.apiClimaAllDays(message_normalized)
                        try {
                            await message.reply(apiClima)
                        } catch (err) {
                            return
                        }
                        break
                    case message_normalized.slice(0, 9) == '/NOTICIAS':
                        try {
                            const apiNews : any = await services.apiNews(message.body.slice(10))
                            if (apiNews.linkImg == null) {
                                try {
                                    chat.sendMessage(apiNews.txt)
                                } catch (err) {
                                    return
                                }
                            } else {
                                const media : any = await MessageMedia.fromUrl(apiNews.linkImg);
                                try {
                                    chat.sendMessage(media, {caption: apiNews.txt})
                                } catch (err) {
                                    return
                                }
                            }          
                        } catch (err) {
                            try {
                                await message.reply("*_Sorry, os servidores das fontes estão meio lentos, tenta mais uma vez pf._*")
                            } catch (err) {
                                return
                            }
                        }
                        break
                    case message_normalized.slice(0,4) == '/CEP':
                        const cepPesquisado : string = message.body.slice(4).replaceAll(" ", "")
                        if (cepPesquisado.slice(4) == '' || cepPesquisado.slice(4).search('-') != -1) {
                            try {
                                await message.reply("Percebi algo diferente, tenta assim: */Cep 04163050*")
                            } catch (err) {
                                return
                            }
                        } else {
                            const resultadoCep = await services.cep(cepPesquisado)
                            await message.reply(resultadoCep)
                        }
                        break
                    default:
                        break
                }
        
                if (possibleToSendMessage == 0) {
                    switch (true) {
                        case message.hasMedia == false && respostaAuto != undefined:
                            try {
                                await this.client.sendMessage(message.from, respostaAuto.mensagem)
                            } catch (err) {
                                return
                            }
                            break
                        case message.hasMedia == true && possibleToSendSticker == 0:
                            try {
                                await message.reply(resultMidia.mensagem)
                            } catch (err) {
                                return
                            }
                            break
                        case message.hasMedia == true && possibleToSendSticker != 0 :
                            try {
                                const sticker : any = MessageMedia.fromFilePath(path.join(__dirname, "/stickers" + services.sendSticker()))
                                chat.sendMessage(sticker, { sendMediaAsSticker: true })
                            } catch (err) {
                                return
                            }
                            break
                        default:
                            break
                    }
                }
        
            } else {
                if (message.id.remote.slice(0, 13) != '5511998342464') { // Número do admin do bot aqui
                    let msgInPv = "Meu criador não permite mais que eu mande mensagem no pv :(\n\nChama ele no pv - https://wa.me/5511998342464"
                    try {
                        await message.reply(msgInPv)
                    } catch (err) {
                        return
                    }
        
                } else {
                    switch (true) {
                        case message.body == '/comandos':
                            await message.reply("*/talkAll* -> Envia mensagem para todos os chats.\n*/talk* -> Envia mensagem  para todos os chat com o CHAT-ON.")
                            break
                        case message.body.slice(0, 8) == '/talkAll':                                   
                            const msgTalkAll: string = message.body.slice(9)
                            try {
                                await message.reply(`_Vou enviar sua mensagem para todos os usuários._\n_msg :_ ${msgTalkAll}`)
                            } catch (err) {
                                return
                            }
                            sendToChats(msgTalkAll, this.client) 
                            break
                        case message.body.slice(0, 5) == '/talk':
                            const msgTalk: string = message.body.slice(6)
                            await message.reply(`_Vou enviar sua mensagem para os grupos com o CHAT-ON._\n_msg :_ *${msgTalk}*`)
                            sendToChatsV2(msgTalk, this.client)
                            break                             
                        default:
                            try {
                                await message.reply("Não entendi esse comando-admin")
                            } catch (err) {
                                return
                            }
                    }
                }
            }
        
        })
    
    }
}


