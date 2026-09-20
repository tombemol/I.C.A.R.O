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
        Migration {
            version: 3,
            description: "persist_progress_and_completions",
            sql: r#"
                CREATE TABLE IF NOT EXISTS player_progress (
                    id TEXT PRIMARY KEY NOT NULL,
                    level INTEGER NOT NULL DEFAULT 1,
                    xp INTEGER NOT NULL DEFAULT 0,
                    xp_to_next INTEGER NOT NULL DEFAULT 500,
                    streak INTEGER NOT NULL DEFAULT 0,
                    last_active_date TEXT,
                    updated_at TEXT NOT NULL
                );

                INSERT OR IGNORE INTO player_progress (
                    id, level, xp, xp_to_next, streak, last_active_date, updated_at
                ) VALUES (
                    'local-player', 1, 0, 500, 0, NULL, datetime('now')
                );

                CREATE TABLE IF NOT EXISTS mission_completion (
                    mission_id TEXT PRIMARY KEY NOT NULL,
                    mission_date TEXT NOT NULL,
                    xp_awarded INTEGER NOT NULL,
                    completed_at TEXT NOT NULL,
                    FOREIGN KEY (mission_id) REFERENCES daily_mission(id)
                );

                CREATE INDEX IF NOT EXISTS idx_mission_completion_date
                ON mission_completion(mission_date);

                CREATE TRIGGER IF NOT EXISTS award_mission_completion
                AFTER INSERT ON mission_completion
                BEGIN
                    UPDATE player_progress
                    SET
                        level = level + CASE
                            WHEN xp + NEW.xp_awarded >= xp_to_next THEN 1
                            ELSE 0
                        END,
                        xp = CASE
                            WHEN xp + NEW.xp_awarded >= xp_to_next
                            THEN xp + NEW.xp_awarded - xp_to_next
                            ELSE xp + NEW.xp_awarded
                        END,
                        xp_to_next = CASE
                            WHEN xp + NEW.xp_awarded >= xp_to_next
                            THEN CAST(ROUND(xp_to_next * 1.15) AS INTEGER)
                            ELSE xp_to_next
                        END,
                        streak = CASE
                            WHEN last_active_date = NEW.mission_date THEN streak
                            WHEN last_active_date = date(NEW.mission_date, '-1 day') THEN streak + 1
                            ELSE 1
                        END,
                        last_active_date = NEW.mission_date,
                        updated_at = NEW.completed_at
                    WHERE id = 'local-player';
                END;
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
