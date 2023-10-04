export default function Sidebar(props) {
    const noteElements = props.notes.map((note, index) => {
        const firstLine = note.body.split('\n')[0];

        return (
            <div key={note.id}>
                <div

                    className={`title ${note.id === props.currentNote.id ? "selected-note" : ""
                        }`}
                    onClick={() => props.setCurrentNoteId(note.id)}
                >
                    <h4 className="text-snippet">{firstLine}</h4>
                </div>
            </div>
        )
    });

    return (
        <section className="pane sidebar">
            <div className="sidebar--header">
                <h3>Notes</h3>
                <button className="new-note" onClick={props.newNote}>+</button>
            </div>
            {noteElements}
        </section>
    );
}