import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import axios from 'axios'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
  app.post('/register', async (request) => {
    // Creating body validation schema
    const bodySchema = z.object({
      code: z.string(),
    })

    // Parsing request body and getting github code
    const { code } = bodySchema.parse(request.body)

    // Requesting access_token from github
    const accessTokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      null,
      {
        params: {
          code,
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
        },
        headers: { Accept: 'application/json' },
      },
    )

    // Getting access token from access token response data
    const { access_token } = accessTokenResponse.data

    // Requesting user info from github
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    // Creating github user info validation schema
    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    // Parsing userResponse data with validation schema
    const userInfo = userSchema.parse(userResponse.data)

    // Verifying if user exists
    let user = await prisma.user.findUnique({
      where: { githubId: userInfo.id },
    })
    if (!user) {
      // If user doesn't exists, we create one
      user = await prisma.user.create({
        data: {
          githubId: userInfo.id,
          login: userInfo.login,
          name: userInfo.name,
          avatarUrl: userInfo.avatar_url,
        },
      })
    }

    // Generating JWT token
    const token = app.jwt.sign(
      { name: user.name, avatarUrl: user.avatarUrl },
      { sub: user.id, expiresIn: '30 days' },
    )

    return { token }
  })
}
