import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
var ROOT_DIR = fileURLToPath(new URL(".", import.meta.url));
/**
 * Creates Vite configuration for the frontend application.
 *
 * @returns Vite configuration object.
 */
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": resolve(ROOT_DIR, "src")
        }
    },
    server: {
        port: 5173
    }
});
