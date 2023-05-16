import { PrismaClient } from '@prisma/client'
import fastfy from 'fastify'

const app = fastfy()
const prisma = new PrismaClient()

app.get('/users', async () => {
  const users = await prisma.user.findMany()
  return users
})

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP Server running on https://localhost:3333')
  })
