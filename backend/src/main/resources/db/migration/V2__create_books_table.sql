CREATE TABLE books (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    description TEXT,
    access_type VARCHAR(20) NOT NULL,
    pdf_url VARCHAR(1000),
    purchase_url VARCHAR(1000),
    cover_url VARCHAR(1000),
    CONSTRAINT chk_books_access_type
        CHECK (access_type IN ('FREE', 'PURCHASE'))
);