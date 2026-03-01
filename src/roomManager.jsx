import { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useContext } from "react";
export default function RoomManager() {
 const [room,setRoom]=useContext
  const handleSubmit = (e) => {
    e.preventDefault();
    
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>add Rooms</h2>
      <input type="text" placeholder="Roomname" onChange={(e) => setUsername(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
}