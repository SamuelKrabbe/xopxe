-- Quem entra com o Google não tem senha.
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;
