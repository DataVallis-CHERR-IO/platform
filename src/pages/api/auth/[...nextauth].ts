import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'
import NextAuth, { Session } from 'next-auth'
import Moralis from 'moralis'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'MoralisAuth',
      credentials: {
        message: {
          label: 'Message',
          type: 'text',
          placeholder: '0x0'
        },
        signature: {
          label: 'Signature',
          type: 'text',
          placeholder: '0x0'
        }
      },
      async authorize(credentials) {
        try {
          const { message, signature } = credentials

          await Moralis.start({ apiKey: process.env.MORALIS_API_KEY })

          const { address, profileId } = (await Moralis.Auth.verify({ message, signature, network: 'evm' })).raw

          return { address, profileId, signature }
        } catch (error) {
          console.error(error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }): Promise<JWT> {
      user && (token.user = user)
      return token
    },
    async session({ session, token }): Promise<Session> {
      session.user = token.user
      return session
    }
  }
})
