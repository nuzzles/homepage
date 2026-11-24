import { useState } from "react"
import { ChevronDown, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/hooks/useLanguage"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const languages = [
    { code: "en", label: "English", flag: "/images/flags/en.svg" },
    { code: "fr", label: "Français", flag: "/images/flags/fr.svg" },
    { code: "fa", label: "فارسی", flag: "/images/flags/fa.svg" },
] as const

export const LanguageSwitcher = ({ englishOnly = false }: { englishOnly?: boolean }) => {
    const { t, language, languageHref, rememberLanguage } = useLanguage()
    const [hintOpen, setHintOpen] = useState(false)
    const selected = languages.find(({ code }) => code === language) ?? languages[0]
    if (englishOnly) {
        return (
            <TooltipProvider delayDuration={200}>
                <Tooltip open={hintOpen} onOpenChange={setHintOpen}>
                    <TooltipTrigger asChild>
                        <Button
                            variant="ghost"
                            className="language-trigger ms-auto shrink-0 rounded-none px-3"
                            aria-label="English Only"
                            onClick={(event) => {
                                event.preventDefault()
                                setHintOpen((open) => !open)
                            }}
                        >
                            <img className="flag" width={24} height={16} src={languages[0].flag} alt="" />
                            <span className="language-label hidden md:inline">English</span>
                            <X aria-hidden="true" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent collisionPadding={16}>English Only</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        )
    }
    return (
        <DropdownMenu dir={language === "fa" ? "rtl" : "ltr"}>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="language-trigger ms-auto shrink-0 rounded-none px-3"
                    aria-label={t("languageSwitcher.label")}
                >
                    <img className="flag" width={24} height={16} src={selected.flag} alt="" />
                    <span className="language-label hidden md:inline">{selected.label}</span>
                    <ChevronDown aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="language-menu min-w-40 rounded-none p-0 shadow-none"
                aria-label={t("languageSwitcher.label")}
            >
                {languages
                    .filter(({ code }) => code !== language)
                    .map(({ code, label, flag }) => (
                        <DropdownMenuItem key={code} className="language-option rounded-none" asChild>
                            <a
                                href={languageHref(code)}
                                hrefLang={code}
                                lang={code}
                                onClick={() => rememberLanguage(code)}
                            >
                                <img className="flag" width={24} height={16} src={flag} alt="" />
                                <span className="language-label">{label}</span>
                            </a>
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
