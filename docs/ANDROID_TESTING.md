# Testar o I.C.A.R.O. 0.4.1 no Android

A 0.4.1 usa APIs nativas, então o navegador serve para layout, mas não valida Health Connect.

## Compatibilidade Android 15+ / 16 KiB

O build Android usa NDK r28 e força alinhamento ELF de 16 KiB na biblioteca Rust. Isso evita o caso desagradavelmente moderno em que o APK instala normalmente e o Android encerra o processo antes mesmo de criar a WebView.

O CI extrai `lib/arm64-v8a/libicaro_lib.so` do APK e valida os segmentos `LOAD`. Se algum voltar a ser ligado com alinhamento inferior a 16 KiB, a build falha e a release não é publicada.

## Requisitos

- Android Studio;
- SDK / Platform Tools / Build Tools;
- NDK;
- JDK 17;
- targets Rust Android;
- AVD Android 14 / API 34 ou superior recomendado.

No Windows:

```powershell
[System.Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Android\Android Studio\jbr", "User")
[System.Environment]::SetEnvironmentVariable("ANDROID_HOME", "$env:LocalAppData\Android\Sdk", "User")

$VERSION = Get-ChildItem -Name "$env:LocalAppData\Android\Sdk\ndk" | Select-Object -Last 1
[System.Environment]::SetEnvironmentVariable("NDK_HOME", "$env:LocalAppData\Android\Sdk\ndk\$VERSION", "User")
```

Targets Rust:

```powershell
rustup target add aarch64-linux-android armv7-linux-androideabi i686-linux-android x86_64-linux-android
```

## Inicializar e rodar

```bash
npm install
npm run android:init
npm run android:dev
```

O diretório `src-tauri/gen` é gerado e não deve ser versionado.

## Health Connect

Na tela Hoje:

1. confirme que aparece o bloco **Vida real conectada**;
2. toque em **Conectar**;
3. conceda uma ou mais permissões de leitura;
4. volte ao I.C.A.R.O.;
5. use **Sincronizar**;
6. confira o resumo de passos, distância e treino;
7. confira eventos recentes em Progresso;
8. se uma quest compatível já atingiu a meta, confirme a conclusão automática;
9. sincronize novamente e confirme que XP não duplica.

Também teste:

- negar todas as permissões;
- liberar apenas uma métrica;
- revogar acesso nas configurações;
- Health Connect sem dados no dia;
- app sem Health Connect disponível;
- conclusão manual com integração desconectada.

## O que deve permanecer verdadeiro

- nenhum prompt abre sem ação do usuário;
- dados brutos não concedem XP;
- sincronização repetida não duplica recompensa;
- uma falha de leitura de uma métrica não impede as demais;
- o app continua útil sem integração;
- a fonte do evento aparece como Health Connect quando aplicável.

## Debug

Com o app em debug:

```text
chrome://inspect/#devices
```

## Build

```bash
npm run android:build
```

O CI da release também executa compilação Android como smoke test. O emulador local continua necessário para validar prompts, permissões e dados reais do provedor.
