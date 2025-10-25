import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { SiweMessage } from "siwe"

/**
 * Lista de direcciones de wallet con permisos de administrador
 * Todas las direcciones se convierten a minúsculas para comparación
 */
const ADMIN_ADDRESSES = ["0x567868827e302b7cA004D37e5F67C51f3e80A971"].map(
  (addr) => addr.toLowerCase()
)

/**
 * Configuración de NextAuth con autenticación SIWE (Sign-In with Ethereum)
 * Permite a los usuarios autenticarse firmando un mensaje con su wallet
 */
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      /**
       * Función de autorización que verifica la firma SIWE
       * @param credentials - Contiene el mensaje SIWE y la firma del usuario
       * @returns Usuario autenticado con su dirección de wallet o null si falla
       */
      async authorize(credentials) {
        try {
          // Validar que tenemos mensaje y firma
          if (!credentials?.message || !credentials?.signature) {
            return null
          }

          // Parsear el mensaje SIWE (viene como string, no JSON)
          const siwe = new SiweMessage(credentials.message)

          // Verificar la firma criptográfica
          const result = await siwe.verify({
            signature: credentials.signature,
          })

          // Si la verificación es exitosa, retornar el usuario
          if (result.success) {
            return {
              id: siwe.address,
            }
          }

          return null
        } catch (e) {
          console.error("Error en autenticación SIWE:", e)
          return null
        }
      },
    }),
  ],
  session: {
    // Usar JWT para las sesiones (sin base de datos)
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    /**
     * Callback de sesión - se ejecuta cada vez que se verifica la sesión
     * Agrega información adicional a la sesión del usuario
     */
    async session({ session, token }) {
      // Agregar la dirección de wallet a la sesión
      session.address = token.sub
      session.user = {
        name: token.sub,
      }

      // Verificar si la dirección es admin comparando con la lista
      if (token.sub) {
        session.isAdmin = ADMIN_ADDRESSES.includes(token.sub.toLowerCase())
      }

      return session
    },
  },
}
