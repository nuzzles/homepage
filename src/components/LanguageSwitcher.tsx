import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/hooks/useLanguage"

const languages = [
    { code: "en", label: "English", flag: "/images/flags/en.svg" },
    { code: "fr", label: "Français", flag: "/images/flags/fr.svg" },
    { code: "fa", label: "فارسی", flag: "/images/flags/fa.svg" },
] as const

export const LanguageSwitcher = ({ englishOnly = false }: { englishOnly?: boolean }) => {
    const { t, language, languageHref, rememberLanguage } = useLanguage()
    const selected = languages.find(({ code }) => code === language) ?? languages[0]
    if (englishOnly) {
        return (
            <span className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium" lang="en">
                <img className="flag hidden sm:inline" src={languages[0].flag} alt="" />
                <span>English Only</span>
            </span>
        )
    }
    return (
        <DropdownMenu dir={language === "fa" ? "rtl" : "ltr"}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="ms-auto shrink-0 px-3" aria-label={t("languageSwitcher.label")}>
                    <img className="flag" src={selected.flag} alt="" />
                    <span className="hidden md:inline">{selected.label}</span>
                    <ChevronDown aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40" aria-label={t("languageSwitcher.label")}>
                {languages
                    .filter(({ code }) => code !== language)
                    .map(({ code, label, flag }) => (
                        <DropdownMenuItem key={code} asChild>
                            <a
                                href={languageHref(code)}
                                hrefLang={code}
                                lang={code}
                                onClick={() => rememberLanguage(code)}
                            >
                                <img className="flag" src={flag} alt="" />
                                {label}
                            </a>
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
