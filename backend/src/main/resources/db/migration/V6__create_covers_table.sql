-- Capas enviadas pelo formulário. Ficam no banco porque o disco do Render
-- é apagado a cada deploy.
CREATE TABLE covers (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    content_type VARCHAR(50) NOT NULL,
    data         BYTEA       NOT NULL
);
