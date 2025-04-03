-- 总功德数表
CREATE TABLE IF NOT EXISTS total_merit (
    id INTEGER PRIMARY KEY CHECK (id = 1),  -- 确保只有一行记录
    merit_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 初始化总功德数（如果表为空）
INSERT OR IGNORE INTO total_merit (id, merit_count) VALUES (1, 0); 