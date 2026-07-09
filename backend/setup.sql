CREATE TABLE IF NOT EXISTS produtos_loja (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    price VARCHAR(50),
    image TEXT,
    description TEXT,
    hotmartLink TEXT,
    status VARCHAR(50) DEFAULT 'Ativo',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
