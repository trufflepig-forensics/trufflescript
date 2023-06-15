import { defineConfig } from "vite";
import typescript from "@rollup/plugin-typescript";

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        sourcemap: true,
        manifest: true,
        minify: true,
        reportCompressedSize: true,
        lib: {
            entry: "src/index.ts",
            name: "trufflescript",
            formats: ["es", "umd"],
            fileName: (format) => `trufflescript.${format}.js`,
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    "react": "React",
                    "react-dom": "ReactDOM",
                },
            },
            plugins: [
                typescript({
                    sourceMap: true,
                    declaration: true,
                    outDir: "dist",
                    include: ["./src/*.ts*"],
                }),
            ],
        },
    },
});
