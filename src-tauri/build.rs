fn main() {
    let target = std::env::var("TARGET").unwrap_or_default();

    // Android 15+ devices may use 16 KiB memory pages. Native libraries linked
    // with a 4 KiB maximum page size can install successfully and still crash
    // before the WebView is created. Force compatible ELF LOAD alignment.
    if target.contains("android") {
        println!("cargo:rustc-link-arg=-Wl,-z,max-page-size=16384");
        println!("cargo:rustc-link-arg=-Wl,-z,common-page-size=16384");
    }

    tauri_build::build()
}
