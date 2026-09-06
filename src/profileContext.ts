import { createContext } from "react"
import type { ProfileConfig, ProfileId } from "@/profiles"

export interface ActiveProfile extends ProfileConfig {
    id: ProfileId
    canonicalUrl: string
}

export const ProfileContext = createContext<ActiveProfile | null>(null)
