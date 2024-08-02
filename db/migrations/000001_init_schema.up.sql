SET TIME ZONE 'America/Sao_Paulo';


CREATE TABLE severities (
                            id SERIAL PRIMARY KEY,
                            level INT UNIQUE NOT NULL,
                            description VARCHAR(255) NOT NULL
                        );

INSERT INTO severities (level, description) VALUES
                                                (1, 'issue high'),
                                                (2, 'high'),
                                                (3, 'medium'),
                                                (4, 'low');

CREATE TABLE tickets (
                         id SERIAL PRIMARY KEY,
                         title VARCHAR(60) NOT NULL,
                         status VARCHAR(20) DEFAULT 'OPEN' NOT NULL CHECK (status IN ('OPEN', 'IN_PROGRESS','BLOCKED','DONE', 'CLOSED')),
                         description TEXT NOT NULL,
                         severity_id INT NOT NULL ,
                         created_at  TIMESTAMP    NOT NULL DEFAULT NOW(),
                         updated_at TIMESTAMP    NOT NULL DEFAULT NOW(),
                         completed_at TIMESTAMP,
                         FOREIGN KEY (severity_id) REFERENCES severities(id));




CREATE INDEX idx_status ON tickets(status);
