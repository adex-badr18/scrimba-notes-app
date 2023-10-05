import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from "react-split";
import { nanoid } from "nanoid";
import { onSnapshot } from 'firebase/firestore';
import { notesCollection } from '../firebase';

export default function App() {
    // Initialize notes with either localStorage notes or empty array
    const [notes, setNotes] = useState(
        () => JSON.parse(localStorage.getItem('notes')) || []
    );

    // Store notes in localStorage whenever it changes.
    useEffect(() => {
        // localStorage.setItem('notes', JSON.stringify(notes)); // localStorage setup
        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            // Sync local notes array with firebase snapshot
            console.log("THINGS ARE CHANGING");
        });

        return unsubscribe;
    }, [notes])

    const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || "");

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

    function createNewNote() {
        const newNote = {
            id: nanoid(),
            body: "# Type your markdown note's title here"
        };

        setNotes(prevNotes => [newNote, ...prevNotes]);
        setCurrentNoteId(newNote.id);
    }

    function updateNote(text) {
        setNotes(oldNotes => {
            const newNotes = [];

            // Put most recently modified note at the top.
            oldNotes.forEach(oldNote => {
                if (oldNote.id === currentNoteId) {
                    newNotes.unshift({ ...oldNote, body: text });
                } else {
                    newNotes.push(oldNote);
                }
            })

            return newNotes;
        })
    }

    function deleteNote(event, noteId) {
        event.stopPropagation();

        setNotes(oldNotes => {
            return oldNotes.filter(oldNote => oldNote.id !== noteId);
        });
    }

    return (
        <main>
            {
                notes.length > 0
                    ?
                    <Split
                        sizes={[30, 70]}
                        direction="horizontal"
                        className="split"
                    >
                        <Sidebar
                            notes={notes}
                            currentNote={currentNote}
                            setCurrentNoteId={setCurrentNoteId}
                            newNote={createNewNote}
                            deleteNote={deleteNote}
                        />
                        {
                            currentNoteId &&
                            notes.length > 0 &&
                            <Editor
                                currentNote={currentNote}
                                updateNote={updateNote}
                            />
                        }
                    </Split>
                    :
                    <div className="no-notes">
                        <h1>You have no notes</h1>
                        <button
                            className="first-note"
                            onClick={createNewNote}
                        >
                            Create one now
                        </button>
                    </div>

            }
        </main>
    )
}
