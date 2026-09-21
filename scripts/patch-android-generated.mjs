import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const NDK_VERSION = "28.2.13676358";
const androidRoot = resolve("src-tauri/gen/android");
const appGradle = resolve(androidRoot, "app/build.gradle.kts");
const gradleProperties = resolve(androidRoot, "gradle.properties");

if (!existsSync(appGradle)) {
  throw new Error(
    "Projeto Android gerado não encontrado. Execute 'tauri android init' antes do patch.",
  );
}

let gradle = readFileSync(appGradle, "utf8");

if (/^\s*ndkVersion\s*=\s*"[^"]+"\s*$/m.test(gradle)) {
  gradle = gradle.replace(
    /^\s*ndkVersion\s*=\s*"[^"]+"\s*$/m,
    `    ndkVersion = "${NDK_VERSION}"`,
  );
} else {
  gradle = gradle.replace(
    "android {",
    `android {\n    ndkVersion = "${NDK_VERSION}"`,
  );
}

if (/useLegacyPackaging\s*=/.test(gradle)) {
  gradle = gradle.replace(
    /useLegacyPackaging\s*=\s*(true|false)/g,
    "useLegacyPackaging = false",
  );
} else {
  const marker = `    ndkVersion = "${NDK_VERSION}"`;
  const packaging = `
    packaging {
        jniLibs {
            useLegacyPackaging = false
        }
    }`;
  gradle = gradle.replace(marker, marker + packaging);
}

// Alguns firmwares OEM tratam saída agressiva de R8 como "app hardening".
// Debug já vem sem minificação; isto também mantém futuros builds de release
// conservadores enquanto o bug upstream permanece aberto.
gradle = gradle.replace(
  /isMinifyEnabled\s*=\s*true/g,
  "isMinifyEnabled = false",
);

const releaseMarker = 'getByName("release") {';
const releaseIndex = gradle.indexOf(releaseMarker);
if (releaseIndex >= 0) {
  const releaseTail = gradle.slice(releaseIndex, releaseIndex + 500);
  if (!/isMinifyEnabled\s*=\s*false/.test(releaseTail)) {
    gradle = gradle.replace(
      releaseMarker,
      releaseMarker + "\n            isMinifyEnabled = false",
    );
  }
}

writeFileSync(appGradle, gradle);

let properties = existsSync(gradleProperties)
  ? readFileSync(gradleProperties, "utf8")
  : "";

if (/^android\.enableR8\.fullMode=/m.test(properties)) {
  properties = properties.replace(
    /^android\.enableR8\.fullMode=.*$/m,
    "android.enableR8.fullMode=false",
  );
} else {
  properties =
    properties.trimEnd() +
    "\n\n# Compatibilidade com firmwares OEM que detectam R8 full mode como app hardening\nandroid.enableR8.fullMode=false\n";
}

writeFileSync(gradleProperties, properties);

console.log(
  `Android gerado ajustado: NDK ${NDK_VERSION}, JNI com empacotamento moderno e R8 em modo compatível.`,
);
