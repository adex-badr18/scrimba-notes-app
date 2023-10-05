import { useState, useEffect } from 'react';
import React from 'react';
import './App.css';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from "react-split";
import { nanoid } from "nanoid";
import { onSnapshot, addDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { notesCollection, db } from '../firebase';

export default function App() {
    // Initialize notes with either localStorage notes or empty array
    const [notes, setNotes] = useState([]);

    const [currentNoteId, setCurrentNoteId] = useState("");

    const currentNote = notes.find(note => note.id === currentNoteId) || notes[0];

    // Sort notes in descending order based on timestamp.
    const sortedNotesArray = notes.sort((a, b) => b.updatedAt - a.updatedAt);

    useEffect(() => {
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

    // set currentNoteId
    useEffect(() => {
        !currentNoteId && setCurrentNoteId(notes[0]?.id);
    }, [notes])

    async function createNewNote() {
        const now = Date.now();
        const newNote = {
            body: "# Type your markdown note's title here",
            createdAt: now,
            updatedAt: now
        };

        const newNoteRef = await addDoc(notesCollection, newNote);
        setCurrentNoteId(newNoteRef.id);
    }

    async function updateNote(text) {
        const noteRef = doc(db, 'notes', currentNoteId);
        await setDoc(
            noteRef, 
            {body: text, updatedAt: Date.now()}, 
            {merge: true}
        );
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
                            notes={sortedNotesArray}
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
