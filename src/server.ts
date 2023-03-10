import express, { Request, NextFunction, Response } from 'express'
import 'express-async-errors'
import { BotPrototype } from './lily'

const app : any = express()
var admin: any = express()
const PORT = process.env.PORT


//Inicializção dos apps
admin.on('mount', async function (parent: any) {   
    const app = new BotPrototype({ id : '00001', bot_name : 'Lily'})
})

app.use('/admin', admin)

//Tratamento de erros ----------------------------
app.use((err : Error, req : Request, res : Response, next : NextFunction) => {
    if (err instanceof Error) {
        return res.status(400).json({
            error : err.message
        })
    }

    return res.status(500).json({
        status: "error",
        message : "internal error"
    })
})


app.listen(PORT, () => {
    console.log("Servidor Online")
})

process.on('uncaughtException', (error, origin) => {
    console.log(`\n${origin} signal received. \n${error}`)
    const app = new BotPrototype({ id : '00001', bot_name : 'Lily'})
})

process.on('unhandledRejection', (error) => {
    console.log(`unhandledRejection signal received. \n${error}`)
})

