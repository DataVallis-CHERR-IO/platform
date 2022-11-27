import NextAuth, { Session } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { JWT } from 'next-auth/jwt'

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'MetaMaskAuth',
      credentials: {
        address: {}
      },
      authorize: async (credentials): Promise<any> => {
        return { name: credentials.address }
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
