import WAWebJS, { Client, Contact, LocalAuth, Message, MessageMedia } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal'
import path from 'path'
import { Services } from "./Services";
import { ArrayGroups } from "./@types/groups";

let groups: ArrayGroups[] = [{ group: "indefinido", possible_sticker: 3, possible_message: 3, chat: 'null' }]

export class bot {

    client: Client
    qrCode: String | undefined
    botNumber!: string
    botName: string = 'BotAdmin'

    constructor() {

        this.client = new Client({
            puppeteer: { headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] },
            authStrategy: new LocalAuth()
        })

        this.client.on('qr', (qr: string) => {
            qrcode.generate(qr, { small: true })
            this.qrCode = qr
        })

        this.client.on('ready', () => {
            console.log('Bot online!')
        });

        this.client.initialize().then(() => {
            this.botNumber = this.client.info.me.user
            this.botName = this.client.info.pushname
            this.start()
        })
    }

    //Formata o texto para minúsculo remove acentos e espaços
    normalizedMessage(messageBody: string): string {
        const normalizedMessage: string = messageBody.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase().replaceAll(" ", "")
        return normalizedMessage
    }

    //Retorna se o usuário é admin do grupo
    isAdmin(participants: any, participant_serialized: string): boolean {
        const arrayAdmin: any = participants.filter((participant: any) => participant.isAdmin == true)
        const isAdmin: boolean = arrayAdmin.some((participantAdmin: any) => participantAdmin.id._serialized == participant_serialized)
        return isAdmin
    }

    //Adiciona o grupo em uma array caso ele não exista e retorna
    dataGroup(chat: WAWebJS.Chat): ArrayGroups {

        const id: string = chat.id._serialized

        const founded: ArrayGroups | undefined = groups.find((element: ArrayGroups) => {
            return element.group === id
        })

        if (founded == undefined) {

            const newGroup: ArrayGroups = { group: id, possible_sticker: 6, possible_message: 6, chat: 'off' }
            groups.push(newGroup)
            return newGroup
        }

        return founded

    }

    //Altera o valor de possible sticker do grupo
    setPossible_sticker(chat: WAWebJS.Chat, value: number = 6): void {

        const id: string = chat.id._serialized

        //Procura dentro da array o grupo, e altera o valor
        for (let i = 0; i < groups.length; i++) {
            if (id == groups[i].group) {
                groups[i].possible_sticker = value
                return
            }
        }

        return

    }

    //Altera o valor de chat do grupo
    setPossible_chat(chat: WAWebJS.Chat, value: string = 'off'): void {

        const id: string = chat.id._serialized

        //Procura dentro da array o grupo, e altera o valor
        for (let i = 0; i < groups.length; i++) {
            if (id == groups[i].group) {
                groups[i].chat = value
                return
            }
        }

        return

    }

    //Altera o valor de possible message do grupo
    setPossible_message(chat: WAWebJS.Chat, value: number = 6): void {

        const id: string = chat.id._serialized

        //Procura dentro da array o grupo, e altera o valor
        for (let i = 0; i < groups.length; i++) {
            if (id == groups[i].group) {
                groups[i].possible_message = value
                return
            }
        }

        return

    }

    //Inicia o bot
    async start(): Promise<void> {

        //Inicia os serviços
        const services: Services = new Services()

        this.client.on('message', async (message: Message) => {

            //Retorna true ou false se é grupo ou não
            const isGroup: boolean = (message.from.search('@g') === -1) ? false : true

            if (isGroup) {

                // Retorna as informações do grupo tipo genérico
                const chat_obj: any = await message.getChat()
                // Retorna mensagem normalizada
                const normalizedMessage: string = this.normalizedMessage(message.body)
                // Gera uma array de todos os pariticpantes
                const participants: any[] = chat_obj.groupMetadata.participants
                // Retorna as funções do chat
                const chat: WAWebJS.Chat = await message.getChat()
                // Adiciona o grupo caso ele não exista
                const thisGroup: ArrayGroups = this.dataGroup(chat)
                // Verifica se é admin
                const isAdmin: boolean = this.isAdmin(participants, message.author!)

                const possibleToSendSticker: number = Math.floor(Math.random() * thisGroup.possible_sticker)
                const possibleToSendMessage: number = Math.floor(Math.random() * thisGroup.possible_message)

                //quando há alguma entrada de texto
                switch (true) {
                    case normalizedMessage == '/boasvindas':
                        const msg_welcome: string = `Oiee, sou a(o) *-- ${this.botName} --* serei a(o) nova(o) companheira(o) do grupo de vocês\n\nEu posso por enquanto marcar todos do grupo, realizar um sorteio e marcar uma pessoa aleatóriamente, posso também animar o grupo quando estiver muito silencioso, posso contar algumas piadas, notícias e ainda interagir com algumas mensagens.\n\nPara ver o que eu posso fazer você pode me chamar digitando meu *nome*, ou */Comandos*\n\n*Palavras chaves até o momento:* _Sair, risadas(kkk) Quero, Legal, Otimo, Sim, Acho, Verdade, Vamos, links, Clima, Melhor, Concordo, Vou, Vai, Vamo, Pix, Compro, Recebi, Comprei, Paguei, Dinheiro, Caro_`
                        try {

                            chat.sendMessage(msg_welcome)

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage.slice(0, 6) == '/todos' && isAdmin == true:
                        let text: string = ''
                        let mentions: Contact[] = []

                        for (let participant of participants) {
                            const contact: any = await this.client.getContactById(participant.id._serialized)

                            mentions.push(contact)
                            text += `@${participant.id.user}`
                        }

                        try {
                            await this.client.sendMessage(message.from, '*Todos os membros foram marcados!!*', { mentions: mentions })
                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage.slice(0, 8) == '/sorteio' && isAdmin == true:
                        const quantityParticipants: number = participants.length //Quantidade de participants
                        let randomNumber: number = Math.floor(Math.random() * quantityParticipants) //Retorna um valor aleatório

                        const contact: any = participants[randomNumber] //Escolhe um participant

                        while (contact.id.user == this.botNumber) { //Retorna outro participant que seja diferente do bot
                            return randomNumber = Math.floor(Math.random() * quantityParticipants)
                        }

                        await chat.sendMessage('Estou sorteando...')
                        setTimeout(async () => {
                            try {
                                await chat.sendMessage(`Não teve para onde correr, foi você @${contact.id.user}`, { mentions: [contact.id._serialized] })
                            } catch (error) {
                                console.log(error)
                            }
                        }, 1500)
                        break
                    case normalizedMessage.slice(0, 4) == '/cep':

                        const searchCep: string = message.body.slice(4).replaceAll(" ", "") //Tira os espaços

                        if (searchCep == '' || searchCep.includes('-')) { //Caso inclua caracteres diferentes ou vazio....

                            try {

                                await message.reply("Percebi algo diferente, tenta assim: */Cep 04163050*")

                            } catch (error) {
                                console.log(error)
                            }

                        } else {
                            try {

                                const cep: string = await services.cep(searchCep)
                                await message.reply(cep)

                            } catch (error) {
                                console.log(error)
                            }
                        }
                        break
                    case normalizedMessage.slice(0, 7) == '/climas':

                        const climate: string = await services.everyDayWheather(normalizedMessage)

                        try {

                            await message.reply(climate)

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage.search('clima') != -1 && normalizedMessage.search('/') == -1:

                        const climate_simply: string = await services.apiWeather()

                        try {

                            await message.reply(climate_simply)

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage.slice(0, 9) == '/noticias':

                        const news: any = await services.apiNews(message.body.slice(10)) //Envia o tema sem normalizar a mensagem

                        if (news.linkImg == null) {

                            try {

                                await chat.sendMessage(news.txt)

                            } catch (error) {
                                await message.reply("*_Desculpe, os servidores das fontes estão meio lentos, tente novamente._*")
                            }
                        } else {

                            try {

                                const media: WAWebJS.MessageMedia = await MessageMedia.fromUrl(news.linkImg)
                                chat.sendMessage(media, { caption: news.txt })

                            } catch (error) {
                                await message.reply("*_Desculpe, os servidores das fontes estão meio lentos, tente novamente._*")
                            }

                        }
                        break
                    case normalizedMessage.search(this.botName.toLowerCase()) != -1 && normalizedMessage.search('/') == 1: //Quando recebe NomedoBot

                        const possibleMessages: string[] = [
                            'Qualquer coisa só digitar */comandos*',
                            'Oi?', 'oq?',
                            'Posso te ajudar? Só digitar */comandos*',
                            'Fala ai', 'digita *_/comandos_* ai pow'
                        ]

                        const selectedMessage: string = possibleMessages[Math.floor(Math.random() * possibleMessages.length)]

                        try {

                            await message.reply(selectedMessage)

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage.search(this.botName.toLowerCase()) != -1 && normalizedMessage.search('/') != 1: //Quando recebe /NomeDoBot

                        const possibleMessages_2: string[] = [
                            'Qualquer coisa só digitar */comandos*',
                            'Posso te ajudar? Só digitar */comandos*',
                            'Eu ajudo mais digitando */comandos*', 'digita *_/comandos_* ai pow'
                        ]

                        const selectedMessage_2: string = possibleMessages_2[Math.floor(Math.random() * possibleMessages_2.length)]

                        try {

                            await message.reply(selectedMessage_2)

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage.slice(0, 9) == '/possible' && isAdmin == true:

                        try {

                            const value_possible: number = parseInt(message.body.slice(9).replaceAll(' ', '')) || 6
                            this.setPossible_sticker(chat, value_possible)

                            await message.reply('*Valor alterado! 😊*')

                        } catch (error) {
                            await message.reply('*Não foi possível alterar o valor de possible do grupo 😒*')
                        }
                        break
                    case normalizedMessage.slice(0, 10) == '/possible2' && isAdmin == true:

                        try {

                            const value_possible: number = parseInt(message.body.slice(10).replaceAll(' ', '')) || 6
                            this.setPossible_message(chat, value_possible)

                            await message.reply('*Valor alterado! 😊*')

                        } catch (error) {
                            await message.reply('*Não foi possível alterar o valor de possible do grupo 😒*')
                        }
                        break
                    case normalizedMessage.slice(0, 5) == '/chat' && isAdmin == true:

                        try {

                            const value_Chat: string = message.body.slice(5).replaceAll(" ", "")

                            if (value_Chat == 'on' || value_Chat == 'off') {

                                this.setPossible_chat(chat, value_Chat)
                                await message.reply('*Valor alterado! 😊*')
                                return

                            } else {
                                await message.reply('*Não foi possível alterar o valor de chat do grupo 😒*')
                            }

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage.slice(0, 6) == '/group' && isAdmin == true:
                        try {

                            await message.reply(`*GroupId : ${thisGroup.group}*\n*Valor de possibilidade: *sticker* - ${thisGroup.possible_sticker} *message* - ${thisGroup.possible_message}  | Chat : ${thisGroup.chat}*`)

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    case normalizedMessage == '/comandos':
                        const comands: string = `*_Meus comandos por enquanto são:_*\n\n*/${this.botName}* - _Aqui você me chama_\n*/Comandos* - _Aqui eu te mostro meus Comandos_\n*/Todos* - Aqui eu marco todos os usuários do Grupo_\n*/Boasvindas* - _Aqui eu me apresento para o Grupo_ :)\n*/Sorteio* - _Aqui eu sorteio ou escolho aleatoriamente algum usuário do grupo e marco ele_\n*/Noticias* - _Aqui eu mostro uma noticia simples para você_ ex: */Notícias Política*\n*/Cep* - _Aqui eu te retorno o cep pesquisado_ ex: */cep 04163050*\n*/Climas* - _Retorno o clima dos próximos 6 dias_\n*/possible* - _Aqui é controlado a frequência de respostas (Apenas admin)_`

                        try {
                            await message.reply(comands)

                        } catch (error) {
                            console.log(error)
                        }
                        break
                    default:
                        break
                }

                //Aqui envia um stickers se estiver dentro da possibilidade do grupo
                if (possibleToSendSticker == 0 && message.body.search('/') == -1 && thisGroup.chat == 'on') {

                    const sticker: WAWebJS.MessageMedia = MessageMedia.fromFilePath(path.join(__dirname, '/stickers' + `/${await services.sendSticker()}`))
                    await chat.sendMessage(sticker, { sendMediaAsSticker: true })
                }

                //Aqui envia uma mensagem do contexto
                if (possibleToSendMessage == 0 && message.body.search('/') == -1 && thisGroup.chat == 'on') {

                    //Caso tenha mídia ou não
                    if (message.hasMedia == true) {

                        const auto_answer: any = await services.contextText('MIDIA')
                        await chat.sendMessage(auto_answer.mensagem)

                    } else {

                        const auto_answer: any = await services.contextText(normalizedMessage)
                        await chat.sendMessage(auto_answer.mensagem)

                    }

                }

            } else { //Caso seja mensagem no pv

                //Verifica se é superAdmin
                const user: string = message.from.replace('@c.us', '')

                if (user == process.env.SUPER_ADMIN) {
                    return

                } else {

                    const msgInPv = "Meu criador não permite mais que eu mande mensagem no pv :(\n\nChama ele no pv - https://wa.me/5511998342464"
                    try {

                        await message.reply(msgInPv)

                    } catch (error) {
                        console.log(error)
                    }
                }
            }

        })

    }
}