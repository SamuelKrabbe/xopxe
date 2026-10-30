-- Uma avaliação por leitor em cada livro; mandar de novo substitui a anterior.
CREATE TABLE reviews (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    book_id    BIGINT        NOT NULL REFERENCES books (id) ON DELETE CASCADE,
    user_id    BIGINT        NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    rating     INTEGER       NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment    VARCHAR(1000),
    created_at TIMESTAMPTZ   NOT NULL,
    updated_at TIMESTAMPTZ   NOT NULL,
    CONSTRAINT uq_reviews_book_user UNIQUE (book_id, user_id)
);
