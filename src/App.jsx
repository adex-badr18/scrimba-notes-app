import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from "react-split";
import { nanoid } from "nanoid";
import { onSnapshot, addDoc, doc, deleteDoc } from 'firebase/firestore';
import { notesCollection, db } from '../firebase';

export default function App() {
    // Initialize notes with either localStorage notes or empty array
    const [notes, setNotes] = useState([]);

    const [currentNoteId, setCurrentNoteId] = useState("");

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

    // Store notes in localStorage whenever it changes.
    useEffect(() => {
        // localStorage.setItem('notes', JSON.stringify(notes)); // localStorage setup
        const unsubscribe = onSnapshot(notesCollection, (snapshot) => {
            // Sync local notes array with firebase snapshot
            const notesArr = snapshot.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            }));
            setNotes(notesArr);
        });

        return unsubscribe;
    }, [])

    useEffect(() => {
        !currentNoteId && setCurrentNoteId(notes[0]?.id);
    }, [notes])

    async function createNewNote() {
        const newNote = {
            body: "# Type your markdown note's title here"
        };

        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id);
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

    async function deleteNote(noteId) {
        const noteRef = doc(db, 'notes', noteId);
        await deleteDoc(noteRef);
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
                        <Editor
                            currentNote={currentNote}
                            updateNote={updateNote}
                        />
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
