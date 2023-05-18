import fastfy from 'fastify'
import 'dotenv/config'
import cors from '@fastify/cors'
import { memoriesRoutes } from './routes/memories'
import { authRoutes } from './routes/auth'
import jwt from '@fastify/jwt'

const app = fastfy()

app.register(cors, { origin: ['http://localhost:3000/'] })
app.register(jwt, {
  secret: 'spacetime',
})
app.register(memoriesRoutes)
app.register(authRoutes)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP Server running on https://localhost:3333')
  })
