"use client"

import { useRouter } from "next/navigation"
import { signOut } from "../lib/auth-client"


export function SignOutButton () {
    const router = useRouter()

    async function handleSignOut() {

        await signOut()
        router.push("/login")
    }

    return <button className="bg-black text-white px-2 rounded-lg w-30" onClick={handleSignOut}>Logout</button>
}