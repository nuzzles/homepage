import { act } from "react"
import { createRoot, type Root } from "react-dom/client"
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { afterEach, beforeEach, describe, expect, it } from "vitest"
import { PreferredLanguageLayout } from "@/components/PreferredLanguageLayout"
import { savePreferredLanguage } from "@/i18n/languagePreference"
import i18n from "@/i18n/i18n"
import type { SupportedLanguage } from "@/i18n/i18n"

const RouteState = () => {
    const location = useLocation()
    const { i18n: activeI18n } = useTranslation()

    return <span>{`${location.pathname}|${activeI18n.language}`}</span>
}

let container: HTMLDivElement
let root: Root

beforeEach(async () => {
    localStorage.clear()
    document.cookie = "preferredLanguage=; Path=/; Max-Age=0"
    await i18n.changeLanguage("en")
    container = document.createElement("div")
    root = createRoot(container)
})

afterEach(async () => {
    await act(async () => root.unmount())
})

describe("preferred language routes", () => {
    it.each([
        ["/", "en"],
        ["/", "fr"],
        ["/", "fa"],
        ["/resume", "fr"],
        ["/sara", "fa"],
        ["/spencer/resume", "en"],
    ] satisfies [string, SupportedLanguage][])("renders %s as %s without changing its path", async (path, language) => {
        savePreferredLanguage(language)

        await act(async () => {
            root.render(
                <MemoryRouter initialEntries={[path]}>
                    <Routes>
                        <Route element={<PreferredLanguageLayout />}>
                            <Route path="*" element={<RouteState />} />
                        </Route>
                    </Routes>
                </MemoryRouter>
            )
        })

        expect(container.textContent).toBe(`${path}|${language}`)
    })
})
