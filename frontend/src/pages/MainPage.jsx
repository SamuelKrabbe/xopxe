import { useState } from "react";
import { BooksCatalog, SearchBar } from "../components";

export function MainPage() {
  const [search, setSearch] = useState("");
  const {selectedBook, setSelectedBook} = useState(null)

  return (
    <div>
      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      <BooksCatalog search={search} onClick={setSelectedBook} />

      {/* <aside> */}
      {/*  {selectedBook ? <BooksInfo selectedBook={selectedBook} /> : <DefaultInfo />}  */}
      {/* </aside> */}
    </div>
  )
}
