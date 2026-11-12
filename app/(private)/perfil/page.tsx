import { auth } from "@/src/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"


 const Profile = async () => {
    const session = await auth.api.getSession({
        headers: await headers()
    })
    
    if(!session) {
        redirect("/login")
    }

    return (
        <div>

            Perfil
        </div>
    )
}

export default Profile