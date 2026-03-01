import { SlotContext } from "../SlotContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";
export default function TeacherDashboard() {

    const navigate = useNavigate();
   const { rooms,getSlotsByRoom,lockslot,unlockslot} = useContext(SlotContext);
  const { currentUser, logout } = useContext(AuthContext);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const handleLockSlot =(id) =>{
      if (window.confirm("Are you sure you want to book this  slot?")) {
      lockslot(id);
   }
  };
    const handleUnlockSlot =(id) =>{
      if (window.confirm("Are you sure you want to unbook this  slot?")) {
        unlockslot(id);
   }
  };
  return (
    <div className="manager-dashboard"> 
     <header className="dashboard-header">
        <h1>Teacher Dashboard</h1>
        <div className="header-actions">
          <span className="user-info">Welcome, {currentUser?.username}!</span>
          <button onClick={handleLogout} className="btn btn-logout">
            Logout
          </button>
        </div>
      </header>
       <div className="dashboard-container">
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
                             <th>booked</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {roomSlots.map((slot) => (
                            <tr key={slot.id}>
                              <td>{slot.day}</td>
                              <td>{slot.startTime}</td>
                              <td>{slot.endTime}</td>
                              <td>{slot.islocked ? "Yes" : "No"}</td>
                              <td>
                                <button
                                  onClick={() => handleLockSlot(slot.id)}
                                  className="btn btn-danger btn-small"
                                >
                                  book
                                </button>
                              </td>
                              <td>
                                <button
                                  onClick={() => handleUnlockSlot(slot.id)}
                                  className="btn btn-secondary btn-small"
                                >
                                  unbook
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
 
        </div>
  );

}