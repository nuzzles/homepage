import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
    plugins: [react()],
    build: {
        rolldownOptions: {
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
