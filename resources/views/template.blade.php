<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>@yield('title')</title>

        {{-- react に変更があったとき自動で --}}
        @viteReactRefresh

        {{-- vite でビルドしたファイルを読み込む --}}
        @yield('vite')

    </head>

    <body class="antialiased">
        <div id="app"></div>
    </body>
</html>