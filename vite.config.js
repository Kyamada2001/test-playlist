import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react'; // <- 追加

export default defineConfig({
    plugins: [
        laravel({
            // input: ['resources/css/app.css', 'resources/js/app.js'],
            refresh: true,

            // typescriptとsassが使えるように変更
            input: [
                'resources/sass/app.scss', 
                'resources/ts/index.tsx'
            ],
        }),
        react(), // <- 追加
    ],
});