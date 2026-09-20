use tauri_plugin_sql::{Migration, MigrationKind};

fn migrations() -> Vec<Migration> {
    vec![
        Migration {
            version: 1,
            description: "create_player_profile",
            sql: r#"
                CREATE TABLE IF NOT EXISTS player_profile (
                    id TEXT PRIMARY KEY NOT NULL,
                    display_name TEXT NOT NULL,
                    height_cm REAL NOT NULL,
                    weight_kg REAL NOT NULL,
                    objective TEXT NOT NULL,
                    difficulty TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                );
            "#,
            kind: MigrationKind::Up,
        },
        Migration {
            version: 2,
            description: "create_daily_missions",
            sql: r#"
                CREATE TABLE IF NOT EXISTS daily_mission (
                    id TEXT PRIMARY KEY NOT NULL,
                    mission_date TEXT NOT NULL,
                    slot INTEGER NOT NULL,
                    template_id TEXT NOT NULL,
                    title TEXT NOT NULL,
                    description TEXT NOT NULL,
                    target REAL NOT NULL,
                    unit TEXT NOT NULL,
                    xp INTEGER NOT NULL,
                    category TEXT NOT NULL,
                    rationale TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    UNIQUE(mission_date, slot)
                );

                CREATE INDEX IF NOT EXISTS idx_daily_mission_date
                ON daily_mission(mission_date);
            "#,
            kind: MigrationKind::Up,
        },
    ]
}

#[tauri::command]
fn app_version() -> &'static str {
    env!("CARGO_PKG_VERSION")
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:icaro.db", migrations())
                .build(),
        )
        .invoke_handler(tauri::generate_handler![app_version])
        .run(tauri::generate_context!())
        .expect("error while running I.C.A.R.O.");
}
