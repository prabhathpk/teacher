import { createContext, useState, useEffect } from "react";

export const SlotContext = createContext();
const API_URL = "https://cac527a5057585eabfd9.free.beeceptor.com";
const initialRooms = [
  { id: "1", name: "Room A", capacity: 30 },
  { id: "2", name: "Room B", capacity: 25 },
];

const initialSlots = [
  { id: "1", roomId: "1", day: "Monday", startTime: "09:00", endTime: "10:00" ,islocked:false},
  { id: "2", roomId: "1", day: "Wednesday", startTime: "14:00", endTime: "15:00" ,islocked:false},
  { id: "3", roomId: "2", day: "Tuesday", startTime: "10:00", endTime: "11:00" ,islocked:false},
];

export const SlotProvider = ({ children }) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [slots, setSlots] = useState(initialSlots);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRooms();
    fetchSlots();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/rooms`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();
      
      if (data && Array.isArray(data) && data.length > 0) {
        setRooms(data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
      setError(err.message);
   
    } finally {
      setLoading(false);
    }
  };

  const fetchSlots = async () => {
    try {
      const response = await fetch(`${API_URL}/slots`);
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      const data = await response.json();

      if (data && Array.isArray(data) && data.length > 0) {
        setSlots(data);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setError(err.message);
    }
  };
  const addRoom = async (roomData) => {
    const id = Date.now().toString();
    const newRoom = { id, ...roomData };
    try {
      const response = await fetch(`${API_URL}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setRooms((prevRooms) => [...prevRooms, newRoom]);
      return id;
    } catch (err) {
      console.error("Failed to add room:", err);
      setError(err.message);
      throw err;
    }
  };

  const deleteRoom = async (id) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
      setSlots((prevSlots) => prevSlots.filter((slot) => slot.roomId !== id));
    } catch (err) {
      console.error("Failed to delete room:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateRoom = async (id, roomData) => {
    try {
      const response = await fetch(`${API_URL}/rooms/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(roomData),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setRooms((prevRooms) =>
        prevRooms.map((room) => (room.id === id ? { ...room, ...roomData } : room))
      );
    } catch (err) {
      console.error("Failed to update room:", err);
      setError(err.message);
      throw err;
    }
  };

  const addSlot = async (slotData) => {
    const id = Date.now().toString();
    const newSlot = { id, ...slotData };
    try {
      const response = await fetch(`${API_URL}/slots`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlot),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setSlots((prevSlots) => [...prevSlots, newSlot]);
      return id;
    } catch (err) {
      console.error("Failed to add slot:", err);
      setError(err.message);
      throw err;
    }
  };

  const deleteSlot = async (id) => {
    try {
      const response = await fetch(`${API_URL}/slots/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== id));
    } catch (err) {
      console.error("Failed to delete slot:", err);
      setError(err.message);
      throw err;
    }
  };

  const updateSlot = async (id, slotData) => {
    try {
      const response = await fetch(`${API_URL}/slots/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slotData),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setSlots((prevSlots) =>
        prevSlots.map((slot) => (slot.id === id ? { ...slot, ...slotData } : slot))
      );
    } catch (err) {
      console.error("Failed to update slot:", err);
      setError(err.message);
      throw err;
    }
  };

  const getSlotsByRoom = (roomId) => {
    return slots.filter((slot) => slot.roomId === roomId);
  };

  const getRoomById = (id) => {
    return rooms.find((room) => room.id === id);
  };
  const lockslot = async (id) => {
    try {
      const response = await fetch(`${API_URL}/slots/${id}/lock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ islocked: true }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setSlots((prevSlots) =>
        prevSlots.map((slot) => (slot.id === id ? { ...slot, islocked: true } : slot))
      );
    } catch (err) {
      console.error("Failed to lock slot:", err);
      setError(err.message);
      throw err;
    }
  };

  const unlockslot = async (id) => {
    try {
      const response = await fetch(`${API_URL}/slots/${id}/lock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ islocked: false }),
      });
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      setSlots((prevSlots) =>
        prevSlots.map((slot) => (slot.id === id ? { ...slot, islocked: false } : slot))
      );
    } catch (err) {
      console.error("Failed to unlock slot:", err);
      setError(err.message);
      throw err;
    }
  };
  return (
    <SlotContext.Provider
      value={{
        rooms,
        slots,
        addRoom,
        deleteRoom,
        updateRoom,
        addSlot,
        deleteSlot,
        updateSlot,
        getSlotsByRoom,
        getRoomById,
        lockslot,
        unlockslot,
        loading,
        error,
      }}
    >
      {children}
    </SlotContext.Provider>
  );
};