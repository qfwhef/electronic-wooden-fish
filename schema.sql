-- 木鱼功德数据表
CREATE TABLE IF NOT EXISTS merit_records (
    id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    merit_count INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引以便快速查找用户数据
CREATE INDEX IF NOT EXISTS idx_merit_records_user_id ON merit_records(user_id); 