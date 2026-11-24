import { useState } from "react"
import { Check, ChevronDown, Globe2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/hooks/useLanguage"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "fa", label: "فارسی" },
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
                            <Globe2 aria-hidden="true" />
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
                    <Globe2 aria-hidden="true" />
                    <span className="language-label hidden md:inline">{selected.label}</span>
                    <ChevronDown className="language-chevron" aria-hidden="true" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="language-menu rounded-none"
                sideOffset={8}
                collisionPadding={20}
                aria-label={t("languageSwitcher.label")}
            >
                <DropdownMenuLabel className="language-menu-title">{t("languageSwitcher.title")}</DropdownMenuLabel>
                {languages.map(({ code, label }) => (
                    <DropdownMenuItem key={code} className="language-option rounded-none" asChild>
                        <a
                            href={languageHref(code)}
                            hrefLang={code}
                            lang={code}
                            aria-current={code === language ? "true" : undefined}
                            onClick={() => rememberLanguage(code)}
                        >
                            <span className="language-label" dir={code === "fa" ? "rtl" : "ltr"}>
                                {label}
                            </span>
                            {code === language && <Check className="language-check" aria-hidden="true" />}
                        </a>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
