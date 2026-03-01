import { createContext, useState } from "react";

export const SlotContext = createContext();

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

  const addRoom = (roomData) => {
    const id = Date.now().toString();
    setRooms((prevRooms) => [...prevRooms, { id, ...roomData }]);
    return id;
  };

  const deleteRoom = (id) => {
    setRooms((prevRooms) => prevRooms.filter((room) => room.id !== id));
    setSlots((prevSlots) => prevSlots.filter((slot) => slot.roomId !== id));
  };

  const updateRoom = (id, roomData) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => (room.id === id ? { ...room, ...roomData } : room))
    );
  };

  const addSlot = (slotData) => {
    const id = Date.now().toString();
    setSlots((prevSlots) => [...prevSlots, { id, ...slotData }]);
    return id;
  };

  const deleteSlot = (id) => {
    setSlots((prevSlots) => prevSlots.filter((slot) => slot.id !== id));
  };

  const updateSlot = (id, slotData) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) => (slot.id === id ? { ...slot, ...slotData } : slot))
    );
  };

  const getSlotsByRoom = (roomId) => {
    return slots.filter((slot) => slot.roomId === roomId);
  };

  const getRoomById = (id) => {
    return rooms.find((room) => room.id === id);
  };
  const lockslot = (id) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) => (slot.id === id ? { ...slot, islocked: true } : slot))
    );
  };

  const unlockslot = (id) => {
    setSlots((prevSlots) =>
      prevSlots.map((slot) => (slot.id === id ? { ...slot, islocked: false } : slot))
    );
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
        unlockslot
      }}
    >
      {children}
    </SlotContext.Provider>
  );
};