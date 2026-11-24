import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { PROFILE_OPTIONS, type ProfileId } from "@/profiles"
import { useLanguage } from "@/hooks/useLanguage"

interface ProfileSwitcherProps {
    value: ProfileId
    label: string
    hrefForProfile: (profile: ProfileId) => string
}
export const ProfileSwitcher = ({ value, label, hrefForProfile }: ProfileSwitcherProps) => {
    const { language } = useLanguage()
    const selected = PROFILE_OPTIONS.find(({ id }) => id === value) ?? PROFILE_OPTIONS[0]
    return (
        <DropdownMenu dir={language === "fa" ? "rtl" : "ltr"}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" aria-label={label} className="min-w-0 px-2 text-lg font-semibold sm:text-xl">
                    <span className="truncate">{selected.name}</span>
                    <ChevronDown aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" aria-label={label}>
                {PROFILE_OPTIONS.filter(({ id }) => id !== value).map(({ id, name }) => (
                    <DropdownMenuItem key={id} asChild>
                        <a href={hrefForProfile(id)}>{name}</a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
