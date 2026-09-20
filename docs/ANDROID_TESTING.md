# Testar o I.C.A.R.O. como Android no PC

O teste recomendado usa o Android Emulator oficial. Ele cria um Android Virtual Device (AVD) que funciona como um celular ou tablet Android dentro do PC.

## O que isso testa de verdade

Diferente do modo responsivo do navegador, o emulador executa:

- o pacote Android gerado pelo Tauri;
- o WebView do Android;
- SQLite nativo;
- lifecycle do app;
- permissões Android;
- densidade, resolução, rotação e navegação do sistema;
- integrações Android futuras, incluindo Health Connect quando a fase chegar.

## 1. Instalar o ambiente

Instale o Android Studio e, no SDK Manager, confirme:

- Android SDK Platform;
- Android SDK Platform-Tools;
- Android SDK Build-Tools;
- Android SDK Command-line Tools;
- NDK (Side by side).

No Windows, configure as variáveis:

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LocalAppData\Android\Sdk", "User")

$VERSION = Get-ChildItem -Name "$env:LocalAppData\Android\Sdk\ndk" | Select-Object -Last 1
[System.Environment]::SetEnvironmentVariable("NDK_HOME", "$env:LocalAppData\Android\Sdk\ndk\$VERSION", "User")
```

Depois reinicie o terminal/IDE e adicione os targets Rust:

```powershell
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

## 2. Criar um celular virtual

No Android Studio:

1. abra **Tools > Device Manager**;
2. escolha **Create Virtual Device**;
3. crie um perfil de telefone, como um Pixel;
4. escolha uma imagem Android recente;
5. conclua e inicie o AVD.

Para a futura integração Health Connect, prefira **Android 14 / API 34 ou superior** com Google Play Services.

## 3. Inicializar Android no projeto

Na raiz do I.C.A.R.O.:

```bash
npm install
npm run android:init
```

Isso gera o projeto Android de suporte em `src-tauri/gen/android`.

O diretório `src-tauri/gen` fica fora do Git de propósito: é código gerado pelo Tauri.

## 4. Rodar no emulador

Com o AVD aberto:

```bash
npm run android:dev
```

O Tauri compila, instala e abre o I.C.A.R.O. no dispositivo virtual.

Para abrir o projeto nativo no Android Studio:

```bash
npm run android:studio
```

## 5. Debug do WebView

Com o app Android em modo debug e o emulador conectado, abra no Chrome do PC:

```text
chrome://inspect/#devices
```

Isso permite inspecionar HTML, CSS, console e rede do WebView Android.

## 6. Testes que vale repetir

Crie pelo menos dois AVDs:

- telefone normal em retrato;
- tablet ou dispositivo redimensionável.

Cheque:

- onboarding em tela estreita;
- teclado virtual sobre formulários;
- navegação inferior;
- rotação;
- reabertura do app com SQLite persistido;
- cold start;
- textos com escala de fonte aumentada;
- botão Voltar do Android.

## Atalho visual

`npm run dev` continua útil para ajustar layout rapidamente no navegador, mas ele não substitui o emulador quando o comportamento depende de Tauri, SQLite ou APIs Android.

## Build Android

Quando quiser gerar APK/AAB:

```bash
npm run android:build
```
