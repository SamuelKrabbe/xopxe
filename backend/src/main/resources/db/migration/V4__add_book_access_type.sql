-- FREE tem PDF para ler; PURCHASE tem link para comprar.
ALTER TABLE books
    ADD COLUMN access_type  VARCHAR(20)   NOT NULL,
    ADD COLUMN pdf_url      VARCHAR(1000),
    ADD COLUMN purchase_url VARCHAR(1000),
    ADD CONSTRAINT chk_books_access_type CHECK (access_type IN ('FREE', 'PURCHASE'));
