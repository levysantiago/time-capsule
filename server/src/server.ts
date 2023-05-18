import fastfy from 'fastify'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'

const app = fastfy()

app.register(cors, { origin: ['http://localhost:3000/'] })
app.register(memoriesRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP Server running on https://localhost:3333')
  })
