const axios = require('axios')
import * as dotenv from 'dotenv'
const fs = require('fs')
dotenv.config()


//Função responsável por requisitar e tratar o cep.
export const servicos = {
    cep: async ( arg : String) => {
        let retorno = ""   
        
        const cep = arg
        const cepPesquisado : any = []
    
        const apiUrl = `https://brasilapi.com.br/api/cep/v1/${cep}`
    
        const api = axios.create(
            {baseURL : apiUrl}
        )
        
        try {
            await api.get().then((response : any) => {
                cepPesquisado.push(response.data)
                retorno = `*Cep pesquisado:* ${cepPesquisado[0]['cep']}            \n\
*Rua:* _${cepPesquisado[0]['street']}_\n\
*Bairro:* _${cepPesquisado[0]['neighborhood']}_\n\
*Cidade:* _${cepPesquisado[0]['city']}_\n\
*Estado:* _${cepPesquisado[0]['state']}_`      
            })
        
            
        } catch (error) {
            retorno = "*Não conseguir achar esse cep* 😑"
        }

        return retorno
    },

    apiClimaAllDays: async (arg? : any) => {
        let respostaNormalized: String = ""
        let argCaracters: any = await arg
        let argNoCaracters : any = argCaracters.slice(8).toLowerCase()
        let mensagem: any = "" 
        const apikeyClima = process.env.API_KEY_CLIMA
        let cidade: any 
        if (argCaracters) {
            cidade = argNoCaracters
        } else {
            cidade = "São Paulo"
        }
        
        let citySearched : any 

        const apiUrl = `https://api.hgbrasil.com/weather?key=${apikeyClima}&city_name=${cidade}`
        
        const api = axios.create(
            {baseURL : apiUrl}
        )
        
        try {
            
            await api.get().then((response : any) => {
                let data = response.data
                for (let i = 0; i < 7; i++) {
                    let item : any = data.results.forecast[i]
                    mensagem = mensagem + `*_Data:_* _${item.date}_\n*_Dia da semana:_* _${item.weekday}_\n*_Max. do dia:_* _${item.max}ºc_ / *_Min. do dia:_* _${item.min}ºc_\n*_Probabilidade de chuva:_* _${item.rain_probability}%_\n*_Condição do dia:_* _"${item.description}"_\n\n`
                    citySearched = data.results.city
                }            
                
            })
            
        } catch (error) {
            respostaNormalized = "Não conseguir achar o clima :(\nTenta de uma forma diferente ex:\n/climas São Paulo\n/Climas Recife"
            
        }
        let msgAll: string = `*_Cidade de referência:_* _${citySearched}_\n*Clima para os próximos* *_7 dias:_*\n\n`
        let cityReferenced : string = `*_Cidade de referência:_* _${citySearched}_*`
        return msgAll + mensagem + cityReferenced

    },

    apiClima: async () => {
        let respostaNormalized: String = ""
        let saida: any = ""
        const apikeyClima = process.env.API_KEY_CLIMA

        const apiUrl = `https://api.hgbrasil.com/weather?key=${apikeyClima}`
        
        const api = axios.create(
            {baseURL : apiUrl}
        )
        
        try {           
            await api.get().then((response : any) => {
                let data = response.data
                saida = `_A temperatura atual é *${data.results.temp}ºc*, com mín. de *${data.results.forecast[0].min}ºc* e max de *${data.results.forecast[0].max}ºc*_.\n_*${data.results.forecast[0].description}*, com *${data.results.forecast[0].rain_probability}%* de chuva._\n
*_Cidade de referência é São Paulo_*`
                
            })
            
        } catch (error) {
            respostaNormalized = "Não conseguir achar o clima 🙄"
            
        }    
        
        return saida      

    },

    analiseDeContexto: async (mensagemAnormalized: String) => {
        let mensagemNormlized = mensagemAnormalized.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toUpperCase()

        let resultado
            
        const arrayMensagemSair = [{ envio : true, mensagem: 'Boa, to pensando sair hoje tbm 😅' },
            { envio : true, mensagem: `Vai sair né?!`}, 
            { envio : true, mensagem: 'Nem falou que ia sair, tava querendo também.... ' },
            { envio : true, mensagem: 'Vai sair de novo? Chama os parsas dessa vez pow' },
            { envio : true, mensagem: 'Carai, ce gosta de sair hein kkkkkk' },
            { envio : true, mensagem: 'Bora no ceará 😂😂' },
            { envio : true, mensagem: 'Cuidado hein, tá perigoso' },
            { envio: true, mensagem: 'Leva a blusa de frio' },
            { envio : true, mensagem: 'Esse povo só sai' },
                
        ]
        
        const arrayMensagemK = [{ envio : true, mensagem: 'Boa, kkkkkk' },
            { envio : true, mensagem: 'kkkkkk' },
            { envio : true, mensagem: 'Não entendi kkkkk' },
            { envio : true, mensagem: 'kkkkk besta' },
            { envio : true, mensagem: 'Essa foi tão boa que vou te colocar como admin kkkk' },
            { envio : true, mensagem: 'tá rindo de quê? kkkk' },
            { envio : true, mensagem: 'kkkkkkkkkkkkk' },
            { envio : true, mensagem: 'hahahahahahah' },
            { envio : true, mensagem: 'Gostei kkkk' },
            { envio : true, mensagem: 'Hoje ces tão que tão kkk' },
            { envio : true, mensagem: 'jjjjjjjjjjjj' },
            { envio: true, mensagem: 'nem teve graça' },
            { envio: true, mensagem: 'Esse povo só rir kkk' },
            { envio: true, mensagem: 'Vm rir pra pessoa ai não fica no vácuo kkkkk' },
            { envio: true, mensagem: 'Vm rir pra pessoa ai não fica sem graça kkkk' },
            { envio: true, mensagem: 'kkkkkkk' },
            { envio: true, mensagem: 'boa kkkk' },
            { envio: true, mensagem: 'kkkk' },
            { envio: true, mensagem: 'shuashuashuashua' },
            { envio: true, mensagem: 'shuashuashuashua' },
            { envio: true, mensagem: '😂😂' },
            { envio: true, mensagem: '😂😂😂😂😂'},
            
        ]

        const arrayMensagemQuero = [{ envio : true, mensagem: 'Eu também quero 😂' },
            { envio : true, mensagem: 'Querer não é poder!' },
            { envio : true, mensagem: 'Eu também quero, mas querer não é poder! 🤣' },
            { envio : true, mensagem: 'Eu quero' },
            { envio : true, mensagem: 'Boa, eu também quero' },
            { envio : true, mensagem: 'Se desse para mim, eu iria' },
            { envio : true, mensagem: 'Mas ce quer tudo também hein' },
            { envio : true, mensagem: 'Unica coisa que eu queria agora era açaí :)' },
            { envio: true, mensagem: 'Queria férias de 12 meses, uma vez a cada ano sempre' },
            { envio: true, mensagem: 'Boa' },
            { envio: true, mensagem: 'Quero cachaça , pinga e dados....' },
            { envio : true, mensagem: 'Boa sorte nessa ai de querer tudo' },
        ]

        const arrayMensagemLegal = [{ envio : true, mensagem: 'Legal mesmo' },
            { envio : true, mensagem: 'Tbm achei' },
            { envio : true, mensagem: 'Será?' },
            { envio : true, mensagem: 'tem que tá vendo' },
            { envio : true, mensagem: 'Legal? Será?' },
            { envio : true, mensagem: 'Mas não seria melhor o que é ilegal? kkkk parei' },
            { envio : true, mensagem: 'tbm acho legal' },
            { envio : true, mensagem: 'Também gostei' },
            { envio: true, mensagem: 'Existe isso mesmo?' },
            { envio: true, mensagem: 'Chave' },
            { envio: true, mensagem: 'Slc, bom de mais' },
            { envio: true, mensagem: 'Melhor' },
            { envio: true, mensagem: 'É bom msm' },
            { envio : true, mensagem: '❤️' },
        ]

        const arrayMensagemSim = [{ envio : true, mensagem: 'Concordo' },
            { envio : true, mensagem: 'Tbm concordo' },
            { envio : true, mensagem: 'Será?' },
            { envio : true, mensagem: 'Tbm acho' },
            { envio : true, mensagem: 'Pensava que era só que eu q pensava assim' },
            { envio : true, mensagem: 'Me identifiquei' },
            { envio : true, mensagem: 'Não esperava menos de vc' },
            { envio : true, mensagem: 'ce acha? Eu tenho quase certeza kkk' },
            { envio : true, mensagem: 'tbm acho' },
            { envio : true, mensagem: 'discordo' },
            { envio: true, mensagem: 'Só vc pensa assim' },
            { envio: true, mensagem: 'Eu tbm penso assim' },
            { envio: true, mensagem: 'Se todo mundo pensasse assim...' },
            { envio: true, mensagem: 'Exemplo...?' },
            { envio : true, mensagem: '👍' }
        ]

        const arrayMensagemVamos = [{ envio : true, mensagem: 'Bora' },
            { envio : true, mensagem: 'Vou tbm 😂' },
            { envio : true, mensagem: 'Eu queria ir , mas tenho que ficar vendo os grupos 🙄' },
            { envio : true, mensagem: 'Mas tem que ser rápido se for para ir' },
            { envio : true, mensagem: 'Demoraram de mais para falarem isso😁' },
            { envio : true, mensagem: 'Eu tbm vou' },
            { envio : true, mensagem: 'Queria ir se fossem todos juntos' },
            { envio : true, mensagem: 'Vou pensar' },
            { envio : true, mensagem: 'vamo ai né, fazer oq' },
            { envio : true, mensagem: 'Nem vou.' },
            { envio : true, mensagem: 'Vai e nem volta kkkkkk' },
            { envio : true, mensagem: 'Se você pagar eu vou' },
            { envio : true, mensagem: 'Quem vai?' },
            { envio: true, mensagem: 'vai sozinhx' },
            { envio : true, mensagem: 'Se eu for, vou levar uns amigos' },
        ]      

        const arrayMensagemCompro = [{ envio : true, mensagem: 'Tá com dinheiro né....' },
            { envio : true, mensagem: 'Pagamento já caiu?😍' },
            { envio : true, mensagem: 'Divide com os pobres esse dinheiro todo ai😂😎' },
            { envio : true, mensagem: 'Tá podre de ricx né' },
            { envio : true, mensagem: 'faz um pix para mim tbm' },
            { envio : true, mensagem: 'trampo bom esse seu, manda meu currículo' },
            { envio : true, mensagem: 'tá podendo faz um pix' },
            { envio : true, mensagem: 'quem é que gasta mais do que recebe... né' },
            { envio : true, mensagem: 'ó ai sim hein' },
            { envio : true, mensagem: 'Paga pra mim' },
            { envio : true, mensagem: 'Paga um sorvete pra mim então' },
            { envio: true, mensagem: 'Chave do meu pix 11998342464, pode mandar sem erro' },
            { envio : true, mensagem: 'Alguém falou em dinheiro? kkkk' },
        ]

        const arrayMensagemMedia = [{ envio : true, mensagem: 'Tá com dinheiro né....' },
            { envio : true, mensagem: 'Nem consigo ver' },
            { envio : true, mensagem: 'Chique hein' },
            { envio : true, mensagem: 'o que é isso? O.O' },
            { envio : true, mensagem: 'manda de novo, não consegui carregar aqui kkk' },
            { envio : true, mensagem: 'pegadinha né?' },
            { envio : true, mensagem: 'sério?' },
            { envio : true, mensagem: 'é isso ai que vc disse que ia mandar hoje? kk' },
            { envio : true, mensagem: 'ó ai sim hein' },
            { envio : true, mensagem: 'onde é isso?' },
            { envio : true, mensagem: "'-'" },
            { envio: true, mensagem: 'pasma estou' },
            { envio : true, mensagem: 'Ai sim' },
        ]

        const arrayMensagemLink = [{ envio : true, mensagem: 'Eu nem entro nessas coisas pq pode ser vírus' },
            { envio : true, mensagem: 'Nem vou entrar pq não confio em vc' },
            { envio : true, mensagem: 'Tenho pavor de link' },
            { envio : true, mensagem: 'Meu criador falou para eu ficar longe de link kkkk' },
            { envio : true, mensagem: 'Meu criador falou para eu ficar longe de link kkkk não sei pq' },
            { envio : true, mensagem: 'Não sei pq eu não consigo ver :(' },
            { envio : true, mensagem: 'Queria ver, não consigo :(' },
            { envio : true, mensagem: 'Se o criador estiver aqui no grupo, pf desenvolva uma forma que eu possa ver isso ai' },
            { envio : true, mensagem: 'aff , ce sabe que eu não consigo ver link pq manda' },
            { envio : true, mensagem: 'link né, sua sorte é que eu não posso te remover... ainda' },
            { envio : true, mensagem: 'Dependedo do grupo q vc mandasse link, ce já tava cortado dele' },
        ]

        switch (true) {
            case mensagemNormlized.search('SAIR') != -1:
                resultado = arrayMensagemSair[Math.floor(Math.random() * arrayMensagemSair.length)]
                break;
            case mensagemNormlized.search('KK') != -1:
                resultado = arrayMensagemK[Math.floor(Math.random() * arrayMensagemK.length)]
                break
            case mensagemNormlized.search('QUERO') != -1 :
                resultado = arrayMensagemQuero[Math.floor(Math.random() * arrayMensagemQuero.length)]
                break;
            case (mensagemNormlized.search('LEGAL') != -1 || mensagemNormlized.search('OTIMO') != -1) || mensagemNormlized.search('MELHOR') != -1:
                resultado = arrayMensagemLegal[Math.floor(Math.random() * arrayMensagemLegal.length)]
                break
            case (mensagemNormlized.search('SIM') != -1 || mensagemNormlized.search('ACHO') != -1) || (mensagemNormlized.search('VERDADE') != -1 || mensagemNormlized.search('CONCORDO') != -1):
                resultado = arrayMensagemSim[Math.floor(Math.random() * arrayMensagemSim.length)]
                break
            case (mensagemNormlized.search('VAMOS') != -1 || mensagemNormlized.search('VOU') != -1) || (mensagemNormlized.search('VAI') != -1 || mensagemNormlized.search('VAMO') != -1 ):
                resultado = arrayMensagemVamos[Math.floor(Math.random() * arrayMensagemVamos.length)]
                break
            case mensagemNormlized.search('PIX') != -1 :
                resultado = arrayMensagemCompro[Math.floor(Math.random() * arrayMensagemCompro.length)]
                break
            case (mensagemNormlized.search('COMPRO') != -1 || mensagemNormlized.search('RECEBI') != -1) || (mensagemNormlized.search('COMPREI') != -1 || mensagemNormlized.search('PAGUEI') != -1) || (mensagemNormlized.search('DINHEIRO') != -1 || mensagemNormlized.search('CARO') != -1) :
                resultado = arrayMensagemCompro[Math.floor(Math.random() * arrayMensagemCompro.length)]
                break
            case mensagemNormlized.search('MIDIA') != -1 :
                resultado = arrayMensagemMedia[Math.floor(Math.random() * arrayMensagemMedia.length)]
                break
            case mensagemNormlized.search('HTTPS') != -1 :
                resultado = arrayMensagemLink[Math.floor(Math.random() * arrayMensagemLink.length)]
                break
            default: 
                resultado = { envio : false }
              
        }
                       
        return resultado
    
    },

    sendSticker: () => {
        
        function getFileNamesInFolder(folderPath : string) {                                       
            return fs.readdirSync(folderPath);
        }      
        
        let stickers : string[] = getFileNamesInFolder(__dirname + '/stickers')
        let result : string = stickers[Math.floor(Math.random() * stickers.length)]
        
        return "/" + result
        
    },

    apiNews: async (arg?: String) => {
        
        let respostaNormalized : {}
        let tema = arg || "politica brasileira"
        const arrayNews: any = []
        const apikey = process.env.API_KEY_NEWS 
        
        function dataAtualFormatada(){
            var data : any = new Date(),
                dia : String = data.getDate().toString(),
                diaF : String = (dia.length == 1) ? '0'+dia : dia,
                mes : String = (data.getMonth()+1).toString(), //+1 pois no getMonth Janeiro começa com zero.
                mesF : String = (mes.length == 1) ? '0'+mes : mes,
                anoF : String = data.getFullYear();
            return anoF+"/"+mesF+"/"+diaF;
        }

        
        const apiUrl : String = `https://newsapi.org/v2/everything?q=${tema.toLowerCase()}&from=${dataAtualFormatada()}to=${dataAtualFormatada()}&language=pt&sortBy=publishedAt&apiKey=${apikey}`
        
        const api = axios.create(
            {baseURL : apiUrl}
        )
        try {

            await api.get().then((response: any) => {
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
                        let sendTxtNoTitle : any = `*${tema}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}_`
                        respostaNormalized = { txt: sendTxtNoTitle, linkImg: null }
                        break
                    default:
                        let sendTxt : any = `*${tema}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}_`
                        respostaNormalized = { txt: sendTxt, linkImg: null }
                }
                
            } else {
                switch (true) {
                    case articleSelected.title == null :
                        let sendTxtNoTitle : any = `*${tema.toUpperCase()}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}`
                        respostaNormalized = { txt: sendTxtNoTitle, linkImg: `${articleSelected.urlToImage}` }
                        break
                    default:
                        let sendTxt : any = `*${articleSelected.title}*\n\nResumo: ${articleSelected.description}\n\n_link para a publicação completa: ${articleSelected.url}_`
                        respostaNormalized = { txt : sendTxt, linkImg : `${articleSelected.urlToImage}`}
                }
                
            }
            
        } else {
            let msgDataEmpty : string = "*Desculpa, não achei nada com o título pesquisado.*\n_Tenta pesquisar o título de uma forma diferente ex :_\n*_/notícias Crimes_*\n*_/notícias Política internacional_*"
            respostaNormalized = { txt : msgDataEmpty, linkImg : null}
        }

        return respostaNormalized

    },

}