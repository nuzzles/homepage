import { useContext } from "react"
import { ProfileContext, type ActiveProfile } from "@/profileContext"

export function useProfile(): ActiveProfile {
    const profile = useContext(ProfileContext)
    if (!profile) throw new Error("useProfile must be used within a ProfileProvider")
    return profile
}
