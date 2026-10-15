CREATE TABLE books (
    id               BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title            VARCHAR(200) NOT NULL,
    author           VARCHAR(160) NOT NULL,
    publisher        VARCHAR(160) NOT NULL,
    genre            VARCHAR(60)  NOT NULL,
    publication_date DATE         NOT NULL,
    synopsis         TEXT         NOT NULL,
    cover_url        VARCHAR(500)
);

CREATE INDEX idx_books_genre ON books (genre);
