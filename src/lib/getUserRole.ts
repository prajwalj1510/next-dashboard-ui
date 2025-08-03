import { auth } from "@clerk/nextjs/server"

export const getUserRole = () => {
    const {userId, sessionClaims} = auth()
    const Role = (sessionClaims?.metadata as { role?: string })?.role
    return {Role, userId}
}