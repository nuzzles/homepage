import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import { resolve } from "node:path"
import { PROFILE_IDS } from "./src/profiles.ts"

export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
            input: {
                root: resolve(import.meta.dirname, "index.html"),
                ...Object.fromEntries(
                    PROFILE_IDS.map((profile) => [profile, resolve(import.meta.dirname, `index-${profile}.html`)])
                ),
            },
            output: {
                codeSplitting: {
                    groups: [
                        {
                            name: "react",
                            test: /node_modules[\\/](react|react-dom|react-router|scheduler)/,
                            priority: 30,
                        },
                        {
                            name: "mui",
                            test: /node_modules[\\/](@mui|@emotion)/,
                            priority: 20,
                        },
                        {
                            name: "i18n",
                            test: /node_modules[\\/](i18next|react-i18next)/,
                            priority: 10,
                        },
                        {
                            name: "vendor",
                            test: /node_modules/,
                        },
                    ],
                },
            },
        },
    },
    resolve: {
        alias: {
            "@": import.meta.dirname + "/src",
        },
    },
})
