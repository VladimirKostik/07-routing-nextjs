'use client';

import { useState, type MouseEventHandler } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";

import { getNotesByQuery, NoteTag } from "@/lib/api";
import type { Note } from "@/types/note";

import SearchBox from "@/components/SearchBox/SearchBox";
import Pagination from "@/components/Pagination/Pagination";
import Modal from "@/components/Modal/Modal";
import NoteForm from "@/components/NoteForm/NoteForm";
import NoteList from "@/components/NoteList/NoteList";

import css from "./Notes.module.css";

interface NotesClientProps {
tag?: NoteTag;
}

export default function NotesClient({ tag }: NotesClientProps) {
const [searchTerm, setSearchTerm] = useState("");
const [currentPage, setCurrentPage] = useState(1);
const [isModalOpen, setIsModalOpen] = useState(false);

const debouncedSearch = useDebouncedCallback((value: string) => {
setSearchTerm(value);
setCurrentPage(1);
}, 1000);

const handleSearchChange = (query: string) => {
debouncedSearch(query);
};

const { data, isLoading, isError } = useQuery({
queryKey: ["notes", searchTerm, tag ?? "", currentPage],
queryFn: () => getNotesByQuery(searchTerm, currentPage, tag),
});

const totalPages = data?.totalPages ?? 0;
const notes: Note[] = data?.notes ?? [];

const handleOpenModal: MouseEventHandler<HTMLButtonElement> = () => {
setIsModalOpen(true);
};

const handleCloseModal = () => {
setIsModalOpen(false);
};

return ( <div className={css.app}> <div className={css.toolbar}> <SearchBox onSearch={handleSearchChange} />

```
    {totalPages > 1 && (
      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    )}

    <button className={css.button} onClick={handleOpenModal}>
      Create note +
    </button>
  </div>

  {isLoading && <p>Loading notes...</p>}
  {isError && <p>Failed to load notes.</p>}

  {!isLoading && !isError && notes.length > 0 && (
    <NoteList notes={notes} />
  )}

  {!isLoading && !isError && notes.length === 0 && (
    <p>No notes found</p>
  )}

  {isModalOpen && (
    <Modal onClose={handleCloseModal}>
      <NoteForm handleCancelNote={handleCloseModal} />
    </Modal>
  )}
</div>


);
}
