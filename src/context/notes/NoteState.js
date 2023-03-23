import { React, useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []

  const [notes, setNotes] = useState(notesInitial)
  // Get all note
  const getNote = async () => {
    //API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxYzYxZGNlMDQ0MWVjNGJkMzk1OWQzIn0sImlhdCI6MTY3OTU4MTY2MH0.5lCcLfzaBySIsi7NJbb7fDD3w-6iMha_qRoo97U4psQ"
      },
    });
    const json = await response.json()
    setNotes(json)
  }


    // Add a note
    const addNote = async (title, description, tag) => {
      //TODO: API call
      //API call
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxYzYxZGNlMDQ0MWVjNGJkMzk1OWQzIn0sImlhdCI6MTY3OTU4MTY2MH0.5lCcLfzaBySIsi7NJbb7fDD3w-6iMha_qRoo97U4psQ"
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const note = await response.json();
      setNotes(notes.concat(note))
      
    }

    // Delete note
    const deleteNote =async (id) => {
      // API call
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxYzYxZGNlMDQ0MWVjNGJkMzk1OWQzIn0sImlhdCI6MTY3OTU4MTY2MH0.5lCcLfzaBySIsi7NJbb7fDD3w-6iMha_qRoo97U4psQ"
        },
      });
      const json = response.json();

      const newNotes = notes.filter((note) => { return note._id !== id })
      setNotes(newNotes)
    }

    //Edit a note
    const editNote = async (id, title, description, tag) => {
      //API call
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjQxYzYxZGNlMDQ0MWVjNGJkMzk1OWQzIn0sImlhdCI6MTY3OTU4MTY2MH0.5lCcLfzaBySIsi7NJbb7fDD3w-6iMha_qRoo97U4psQ"
        },
        body: JSON.stringify({ title, description, tag }),
      });
      const json =await response.json();
     

      let newNotes = JSON.parse(JSON.stringify(notes))
      // Logic to edit in client
      for (let index = 0; index < newNotes.length; index++) {
        const element = newNotes[index];
        if (element._id === id) {
          newNotes[index].title = title;
          newNotes[index].description = description;
          newNotes[index].tag = tag;
          break;
        }
      }
      setNotes(newNotes);
    }

    return (
      <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNote }}>
        {props.children}
      </NoteContext.Provider>
    )
  }

  export default NoteState;