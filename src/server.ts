//Este arquivo é responsável por ligar o servidor, e direcionar as rotas a serem feitas.

import Fastify, { FastifyInstance } from 'fastify'
import { bot } from './AdminBot'

const fastify: FastifyInstance = Fastify({
    logger: true,
    disableRequestLogging: true
})

const app: bot = new bot()



const start = async () => {
    try {
        await fastify.listen({ port: 3000, host: '0.0.0.0' })
    } catch (err) {
        fastify.log.error(err)
        process.exit
    }
}

start()

process.on('uncaughtException', (error, origin) => {
    console.log(`\n${origin} signal received. \n${error}`)
})

process.on('unhandledRejection', (error) => {
    console.log(`unhandledRejection signal received. \n${error}`)
})

export default fastify