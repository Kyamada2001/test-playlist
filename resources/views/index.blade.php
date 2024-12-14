@extends('template')
@section('title', config('app_services.service_name'))
@section('vite')
    @vite(['resources/sass/app.scss', 'resources/ts/App.tsx'])
@endsection