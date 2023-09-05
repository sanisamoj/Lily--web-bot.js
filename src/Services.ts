import axios, { AxiosInstance, AxiosResponse } from 'axios'
import fs from 'fs'
import * as dotenv from 'dotenv'
dotenv.config()

export class Services {

    async cep(cep: string): Promise<string> {

        let searchCep: any[] = []
        let result: string = ''

        const apiUrl: string = `https://brasilapi.com.br/api/cep/v1/${cep}`

        const api: AxiosInstance = axios.create()

        try {

            await api.get(apiUrl).then((response: AxiosResponse<any, any>) => {
                searchCep.push(response.data)

                result = `*Cep pesquisado:* ${searchCep[0]['cep']}\n` +
                    `*Rua:* _${searchCep[0]['street']}_\n` +
                    `*Bairro:* _${searchCep[0]['neighborhood']}_\n` +
                    `*Cidade:* _${searchCep[0]['city']}_\n` +
                    `*Estado:* _${searchCep[0]['state']}_`
            })

            return result

        } catch (error) {
            return result = '*Não conseguir achar este cep*'
        }

    }

    async everyDayWheather(message_city: string): Promise<string> {


        let result: string
        let message: string = ''
        let city: string

        const arg: string = message_city
        const arg_normalized: string = arg.slice(7).toLowerCase()
        const apikeyClima = process.env.API_KEY_CLIMA

        if (arg_normalized != '') {
            city = arg_normalized
        } else {
            city = "São Paulo"
        }

        let citySearched: any

        const apiUrl = `https://api.hgbrasil.com/weather?key=${apikeyClima}&city_name=${city}`
        console.log(apiUrl)

        const api = axios.create()

        try {

            await api.get(apiUrl).then((response: any) => {
                let data = response.data
                for (let i = 0; i < 7; i++) {
                    let item: any = data.results.forecast[i]
                    message = message + `*_Data:_* _${item.date}_\n*_Dia da semana:_* _${item.weekday}_\n*_Max. do dia:_* _${item.max}ºc_ / *_Min. do dia:_* _${item.min}ºc_\n*_Probabilidade de chuva:_* _${item.rain_probability}%_\n*_Condição do dia:_* _"${item.description}"_\n\n`
                    citySearched = data.results.city
                }

            })

            const msgAll: string = `*_Cidade de referência:_* _${citySearched}_\n*Clima para os próximos* *_7 dias:_*\n\n`
            const cityReferenced: string = `*_Cidade de referência:_* _${citySearched}_*`
            return msgAll + message + cityReferenced

        } catch (error) {
            return result = "Não conseguir achar o clima :(\nTenta de uma forma diferente ex:\n/climas São Paulo\n/Climas Recife"
        }

    }

    async apiWeather(): Promise<string> {

        let result: string = ''
        const apikeyWeather: string | undefined = process.env.API_KEY_CLIMA

        const apiUrl: string = `https://api.hgbrasil.com/weather?key=${apikeyWeather}`

        const api: AxiosInstance = axios.create()

        try {
            await api.get(apiUrl).then((response: any) => {
                let data: any = response.data
                result = `_A temperatura atual é *${data.results.temp}ºc*, com mín. de *${data.results.forecast[0].min}ºc* e max de *${data.results.forecast[0].max}ºc*_.\n_*${data.results.forecast[0].description}*, com *${data.results.forecast[0].rain_probability}%* de chuva._\n
*_Cidade de referência é São Paulo_*`

            })

            return result

        } catch (error) {

            return result = "Não conseguir achar o clima :("

        }

    }

    async sendSticker(): Promise<string> {

        function getFileNamesInFolder(folderPath: string) {
            return fs.readdirSync(folderPath);
        }

        const stickers: string[] = getFileNamesInFolder(__dirname + '/stickers')
        const result: string = stickers[Math.floor(Math.random() * stickers.length)]

        return result
    }

    contextText(mensagemAnormalized: String): any {

        let mensagemNormlized = mensagemAnormalized.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()

        let resultado: any

        const arrayMensagemSair = [{ mensagem: 'Boa, to pensando sair hoje tbm' },
        { mensagem: `Vai sair né?!` },
        { mensagem: 'Nem falou que ia sair, tava querendo também.... ' },
        { mensagem: 'Vai sair de novo? Chama os parsas dessa vez pow' },
        { mensagem: 'Carai, ce gosta de sair hein kkkkkk' },
        { mensagem: 'Chama o João e a Mari que eles mau saem de casa' },
        { mensagem: 'Bora no ceará kkkk' },
        { mensagem: 'Cuidado hein, tá perigoso' },
        { mensagem: 'Leva a blusa de frio' },
        { mensagem: 'Esse povo só sai' },

        ]

        const arrayMensagemK = [{ mensagem: 'Boa, kkkkkk' },
        { mensagem: 'kkkkkk' },
        { mensagem: 'Não entendi kkkkk' },
        { mensagem: 'kkkkk besta' },
        { mensagem: 'Essa foi tão boa que vou te colocar como admin kkkk' },
        { mensagem: 'tá rindo de quê? kkkk' },
        { mensagem: 'kkkkkkkkkkkkk' },
        { mensagem: 'hahahahahahah' },
        { mensagem: 'Gostei kkkk' },
        { mensagem: 'Hoje ces tão que tão kkk' },
        { mensagem: 'jjjjjjjjjjjj' },
        { mensagem: 'nem teve graça' },
        { mensagem: 'Esse povo só rir kkk' },
        { mensagem: 'Vm rir pra pessoa ai não fica no vácuo kkkkk' },
        { mensagem: 'Vm rir pra pessoa ai não fica sem graça kkkk' },
        { mensagem: 'kkkkkkk' },
        { mensagem: 'boa kkkk' },
        { mensagem: 'kkkk' },
        { mensagem: 'shuashuashuashua' },
        { mensagem: 'shuashuashuashua' },

        ]

        const arrayMensagemQuero = [{ mensagem: 'Eu também quero' },
        { mensagem: 'Querer não é poder!' },
        { mensagem: 'Eu também quero, mas querer não é poder!' },
        { mensagem: 'Eu quero' },
        { mensagem: 'Boa, eu também quero' },
        { mensagem: 'Se desse para mim, eu iria' },
        { mensagem: 'Mas ce quer tudo também hein' },
        { mensagem: 'Unica coisa que eu queria agora era açaí :)' },
        { mensagem: 'Queria férias de 12 meses, uma vez a cada ano sempre' },
        { mensagem: 'Boa' },
        { mensagem: 'Quero cachaça , pinga e dados....' },
        { mensagem: 'Boa sorte nessa ai de querer tudo' },
        ]

        const arrayMensagemLegal = [{ mensagem: 'Legal mesmo' },
        { mensagem: 'Tbm achei' },
        { mensagem: 'Será?' },
        { mensagem: 'tem que tá vendo' },
        { mensagem: 'Legal? Será?' },
        { mensagem: 'Mas não seria melhor o que é ilegal? kkkk parei' },
        { mensagem: 'tbm acho legal' },
        { mensagem: 'Também gostei' },
        { mensagem: 'Existe isso mesmo?' },
        { mensagem: 'Chave' },
        { mensagem: 'Slc, bom de mais' },
        { mensagem: 'Melhor' },
        { mensagem: 'É bom msm' },
        ]

        const arrayMensagemSim = [{ mensagem: 'Concordo' },
        { mensagem: 'Tbm concordo' },
        { mensagem: 'Será?' },
        { mensagem: 'Tbm acho' },
        { mensagem: 'Pensava que era só que eu q pensava assim' },
        { mensagem: 'Me identifiquei' },
        { mensagem: 'Não esperava menos de vc' },
        { mensagem: 'ce acha? Eu tenho quase certeza kkk' },
        { mensagem: 'tbm acho' },
        { mensagem: 'discordo' },
        { mensagem: 'Só vc pensa assim' },
        { mensagem: 'Eu tbm penso assim' },
        { mensagem: 'Se todo mundo pensasse assim...' },
        { mensagem: 'Exemplo...?' },
        ]

        const arrayMensagemVamos = [{ mensagem: 'Bora' },
        { mensagem: 'Vou tbm' },
        { mensagem: 'Eu queria ir , mas tenho que ficar vendo os grupos' },
        { mensagem: 'Mas tem que ser rápido se for para ir' },
        { mensagem: 'Demoraram de mais para falarem isso' },
        { mensagem: 'Eu tbm vou' },
        { mensagem: 'Queria ir se fossem todos juntos' },
        { mensagem: 'Vou pensar' },
        { mensagem: 'vamo ai né, fazer oq' },
        { mensagem: 'Nem vou.' },
        { mensagem: 'Vai e nem volta kkkkkk' },
        { mensagem: 'Se você pagar eu vou' },
        { mensagem: 'Quem vai?' },
        { mensagem: 'vai sozinhx' },
        { mensagem: 'Se eu for, vou levar uns amigos' },
        ]

        const arrayMensagemCompro = [{ mensagem: 'Tá com dinheiro né....' },
        { mensagem: 'Pagamento já caiu?' },
        { mensagem: 'Divide com os pobres esse dinheiro todo ai' },
        { mensagem: 'Tá podre de ricx né' },
        { mensagem: 'faz um pix para mim tbm' },
        { mensagem: 'trampo bom esse seu, manda meu currículo' },
        { mensagem: 'tá podendo faz um pix' },
        { mensagem: 'quem é que gasta mais do que recebe... né' },
        { mensagem: 'ó ai sim hein' },
        { mensagem: 'Paga pra mim' },
        { mensagem: 'Paga um sorvete pra mim então' },
        { mensagem: 'Chave do meu pix 11998342464, pode mandar sem erro' },
        { mensagem: 'Alguém falou em dinheiro? kkkk' },
        ]

        const arrayMensagemMedia = [{ mensagem: 'Tá com dinheiro né....' },
        { mensagem: 'Nem consigo ver' },
        { mensagem: 'Chique hein' },
        { mensagem: 'o que é isso? O.O' },
        { mensagem: 'manda de novo, não consegui carregar aqui kkk' },
        { mensagem: 'pegadinha né?' },
        { mensagem: 'sério?' },
        { mensagem: 'é isso ai que vc disse que ia mandar hoje? kk' },
        { mensagem: 'ó ai sim hein' },
        { mensagem: 'onde é isso?' },
        { mensagem: "'-'" },
        { mensagem: 'pasma estou' },
        { mensagem: 'Ai sim' },
        ]

        const arrayMensagemLink = [{ mensagem: 'Eu nem entro nessas coisas pq pode ser vírus' },
        { mensagem: 'Nem vou entrar pq não confio em vc' },
        { mensagem: 'Tenho pavor de link' },
        { mensagem: 'Meu criador falou para eu ficar longe de link kkkk' },
        { mensagem: 'Meu criador falou para eu ficar longe de link kkkk não sei pq' },
        { mensagem: 'Não sei pq eu não consigo ver :(' },
        { mensagem: 'Queria ver, não consigo :(' },
        { mensagem: 'Se o criador estiver aqui no grupo, pf desenvolva uma forma que eu possa ver isso ai' },
        { mensagem: 'aff , ce sabe que eu não consigo ver link pq manda' },
        { mensagem: 'link né, sua sorte é que eu não posso te remover... ainda' },
        { mensagem: 'Dependedo do grupo q vc mandasse link, ce já tava cortado dele' },
        ]

        switch (true) {
            case mensagemNormlized.search('SAIR') != -1:
                resultado = arrayMensagemSair[Math.floor(Math.random() * arrayMensagemSair.length)]
                break;
            case mensagemNormlized.search('KK') != -1:
                resultado = arrayMensagemK[Math.floor(Math.random() * arrayMensagemK.length)]
                break
            case mensagemNormlized.search('QUERO') != -1:
                resultado = arrayMensagemQuero[Math.floor(Math.random() * arrayMensagemQuero.length)]
                break;
            case (mensagemNormlized.search('LEGAL') != -1 || mensagemNormlized.search('OTIMO') != -1) || mensagemNormlized.search('MELHOR') != -1:
                resultado = arrayMensagemLegal[Math.floor(Math.random() * arrayMensagemLegal.length)]
                break
            case (mensagemNormlized.search('SIM') != -1 || mensagemNormlized.search('ACHO') != -1) || (mensagemNormlized.search('VERDADE') != -1 || mensagemNormlized.search('CONCORDO') != -1):
                resultado = arrayMensagemSim[Math.floor(Math.random() * arrayMensagemSim.length)]
                break
            case (mensagemNormlized.search('VAMOS') != -1 || mensagemNormlized.search('VOU') != -1) || (mensagemNormlized.search('VAI') != -1 || mensagemNormlized.search('VAMO') != -1):
                resultado = arrayMensagemVamos[Math.floor(Math.random() * arrayMensagemVamos.length)]
                break
            case mensagemNormlized.search('PIX') != -1:
                resultado = arrayMensagemCompro[Math.floor(Math.random() * arrayMensagemCompro.length)]
                break
            case (mensagemNormlized.search('COMPRO') != -1 || mensagemNormlized.search('RECEBI') != -1) || (mensagemNormlized.search('COMPREI') != -1 || mensagemNormlized.search('PAGUEI') != -1) || (mensagemNormlized.search('DINHEIRO') != -1 || mensagemNormlized.search('CARO') != -1):
                resultado = arrayMensagemCompro[Math.floor(Math.random() * arrayMensagemCompro.length)]
                break
            case mensagemNormlized.search('MIDIA') != -1:
                resultado = arrayMensagemMedia[Math.floor(Math.random() * arrayMensagemMedia.length)]
                break
            case mensagemNormlized.search('HTTPS') != -1:
                resultado = arrayMensagemLink[Math.floor(Math.random() * arrayMensagemLink.length)]
                break
            default:
                return

        }

        return resultado

    }

    async apiNews(news: string): Promise<any> {

        let respostaNormalized: any
        let tema: string = news || "politica brasileira"
        const arrayNews: any = []
        const apikey: string | undefined = process.env.API_KEY_NEWS

        function dataAtualFormatada(): string {
            var data: Date = new Date(),
                dia: string = data.getDate().toString(),
                diaF: string = (dia.length == 1) ? '0' + dia : dia,
                mes: string = (data.getMonth() + 1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                mesF: string = (mes.length == 1) ? '0' + mes : mes,
                anoF = data.getFullYear();
            return anoF + "/" + mesF + "/" + diaF;
        }


        const apiUrl: string = `https://newsapi.org/v2/everything?q=${tema.toLowerCase()}&from=${dataAtualFormatada()}to=${dataAtualFormatada()}&language=pt&sortBy=publishedAt&apiKey=${apikey}`

        const api: AxiosInstance = axios.create()
        try {

            await api.get(apiUrl).then((response: any) => {
                arrayNews.push(response.data)
            })

        } catch (e) {
            return
        }

        if (arrayNews[0].totalResults != 0) {
            let articleSelected: any = arrayNews[0].articles[Math.floor(Math.random() * arrayNews[0].articles.length)]
            if (articleSelected.urlToImage == null) {
                switch (true) {
                    case articleSelected.title == null:
                        let sendTxtNoTitle: any = `*${tema}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}_`
                        respostaNormalized = { txt: sendTxtNoTitle, linkImg: null }
                        break
                    default:
                        let sendTxt: any = `*${tema}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}_`
                        respostaNormalized = { txt: sendTxt, linkImg: null }
                }

            } else {
                switch (true) {
                    case articleSelected.title == null:
                        let sendTxtNoTitle: any = `*${tema.toUpperCase()}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}`
                        respostaNormalized = { txt: sendTxtNoTitle, linkImg: `${articleSelected.urlToImage}` }
                        break
                    default:
                        let sendTxt: any = `*${articleSelected.title}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}_`
                        respostaNormalized = { txt: sendTxt, linkImg: `${articleSelected.urlToImage}` }
                }

            }

        } else {
            let msgDataEmpty: string = "*Desculpa, não achei nada com o título pesquisado.*\n_Tenta pesquisar o título de uma forma diferente ex :_\n*_/notícias Crimes_*\n*_/notícias Política internacional_*"
            respostaNormalized = { txt: msgDataEmpty, linkImg: null }
        }

        return respostaNormalized

    }

}