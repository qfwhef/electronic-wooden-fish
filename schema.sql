-- 总功德数表
CREATE TABLE IF NOT EXISTS total_merit (
    id INTEGER PRIMARY KEY CHECK (id = 1),  -- 确保只有一行记录
    merit_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初始化总功德数（如果表为空）
INSERT OR IGNORE INTO total_merit (id, merit_count) VALUES (1, 0);

CREATE TABLE IF NOT EXISTS merit_records (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    merit_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_merit_records_user_id ON merit_records(user_id); 