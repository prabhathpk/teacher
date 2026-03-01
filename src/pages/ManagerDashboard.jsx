import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import { SlotContext } from "../SlotContext";
import "../styles/ManagerDashboard.css";

export default function ManagerDashboard() {
  const { rooms, addRoom, deleteRoom, addSlot, deleteSlot, getSlotsByRoom } = useContext(SlotContext);
  const { currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const [roomName, setRoomName] = useState("");
  const [roomCapacity, setRoomCapacity] = useState("");
  const [roomError, setRoomError] = useState("");

  const [selectedRoom, setSelectedRoom] = useState("");
  const [slotDay, setSlotDay] = useState("Monday");
  const [slotStartTime, setSlotStartTime] = useState("");
  const [slotEndTime, setSlotEndTime] = useState("");
  const [slotError, setSlotError] = useState("");
  const [slotLock,setSlotlock] = useState(true);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const handleAddRoom = (e) => {
    e.preventDefault();
    setRoomError("");

    if (!roomName.trim()) {
      setRoomError("Room name is required");
      return;
    }

    if (!roomCapacity || roomCapacity <= 0) {
      setRoomError("Capacity must be a positive number");
      return;
    }

    try {
      addRoom({ name: roomName, capacity: parseInt(roomCapacity) });
      setRoomName("");
      setRoomCapacity("");
    } catch (err) {
      setRoomError(err.message);
    }
  };

  const handleAddSlot = (e) => {
    e.preventDefault();
    setSlotError("");

    if (!selectedRoom) {
      setSlotError("Please select a room");
      return;
    }

    if (!slotStartTime || !slotEndTime) {
      setSlotError("Start and end times are required");
      return;
    }

    if (slotStartTime >= slotEndTime) {
      setSlotError("Start time must be before end time");
      return;
    }

    try {
      addSlot({
        roomId: selectedRoom,
        day: slotDay,
        startTime: slotStartTime,
        endTime: slotEndTime,
        islocked:false
      });
      setSlotStartTime("");
      setSlotEndTime("");
    } catch (err) {
      setSlotError(err.message);
    }
  };

  const handleDeleteRoom = (id) => {
    if (window.confirm("Are you sure you want to delete this room and all its slots?")) {
      deleteRoom(id);
    }
  };

  const handleDeleteSlot = (id) => {
    if (window.confirm("Are you sure you want to delete this slot?")) {
      deleteSlot(id);
    }
  };

  return (
    <div className="manager-dashboard">
      <header className="dashboard-header">
        <h1>Manager Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {currentUser?.username}!</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </header>

      <div className="dashboard-container">
        <section className="section add-room-section">
          <h2>Add New Room</h2>
          <form onSubmit={handleAddRoom} className="form">
            <div className="form-group">
              <label htmlFor="room-name">Room Name</label>
              <input
                id="room-name"
                type="text"
                placeholder="e.g., Room A, Lab 1"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="room-capacity">Capacity</label>
              <input
                id="room-capacity"
                type="number"
                placeholder="e.g., 30"
                value={roomCapacity}
                onChange={(e) => setRoomCapacity(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Room
            </button>
            {roomError && <p className="error">{roomError}</p>}
          </form>
        </section>

        <section className="section add-slot-section">
          <h2>Add New Slot</h2>
          <form onSubmit={handleAddSlot} className="form">
            <div className="form-group">
              <label htmlFor="room-select">Select Room</label>
              <select
                id="room-select"
                value={selectedRoom}
                onChange={(e) => setSelectedRoom(e.target.value)}
              >
                <option value="">Choose a room...</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} (Capacity: {room.capacity})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="slot-day">Day</label>
              <select id="slot-day" value={slotDay} onChange={(e) => setSlotDay(e.target.value)}>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="slot-start">Start Time</label>
              <input
                id="slot-start"
                type="time"
                value={slotStartTime}
                onChange={(e) => setSlotStartTime(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="slot-end">End Time</label>
              <input
                id="slot-end"
                type="time"
                value={slotEndTime}
                onChange={(e) => setSlotEndTime(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add Slot
            </button>
            {slotError && <p className="error">{slotError}</p>}
          </form>
        </section>
      </div>

  
      <section className="section rooms-section">
        <h2>Rooms & Slots</h2>
        {rooms.length === 0 ? (
          <p>No rooms available. Create one above.</p>
        ) : (
          <div className="rooms-list">
            {rooms.map((room) => {
              const roomSlots = getSlotsByRoom(room.id);
              return (
                <div key={room.id} className="room-card">
                  <div className="room-header">
                    <div>
                      <h3>{room.name}</h3>
                      <p>Capacity: {room.capacity} students</p>
                    </div>
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="btn btn-danger"
                    >
                      Delete Room
                    </button>
                  </div>

                  <div className="slots-table">
                    <h4>Slots for {room.name}</h4>
                    {roomSlots.length === 0 ? (
                      <p>No slots available for this room</p>
                    ) : (
                      <table>
                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomSlots.map((slot) => (
                            <tr key={slot.id}>
                              <td>{slot.day}</td>
                              <td>{slot.startTime}</td>
                              <td>{slot.endTime}</td>
                              <td>
                                <button
                                  onClick={() => handleDeleteSlot(slot.id)}
                                  className="btn btn-danger btn-small"
                                >
                                  Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}