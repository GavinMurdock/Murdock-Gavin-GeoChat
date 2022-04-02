import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Route, Routes } from 'react-router-dom';
import { Rooms } from './rooms';
import { Room } from './room';
import { ChatRoom } from '../chat_room/_chat_room';
import { NewRoomModal } from './new_room_modal';

export const Home = () => {
  const api = useContext(ApiContext);
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [lat, setLat] = useState(null);
  const [long, setLong] = useState(null);
  const [newRoom, setNewRoom] = useState(null);

  useEffect(async () => {
    navigator.geolocation.getCurrentPosition((location) => {
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
    });
    const res = await api.get('/users/me');
    setUser(res.user);
  }, []);

  useEffect(async () => {
    const { chatRooms } = await api.get('/chat_rooms');
    const closeChatRooms = isClose(chatRooms);
    setChatRooms(closeChatRooms);
    setLoading(false);
  }, [long]);

  const isClose = (chatRooms) => {
    let closeRooms = [];
    for (let chatRoom of chatRooms) {
      // earth's radius in km
      const R = 6371;

      // distance between latitudes and longitudes
      const dLat = ((chatRoom.lat - lat) * Math.PI) / 180.0;
      const dLon = ((chatRoom.long - long) * Math.PI) / 180.0;

      // to radians
      const lat1 = (lat * Math.PI) / 180.0;
      const lat2 = (chatRoom.lat * Math.PI) / 180.0;

      // haversine formula
      const a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
      const distance = R * (2 * Math.asin(Math.sqrt(a)));

      console.log('room ' + chatRoom.name + ' was ' + distance + ' km away.');
      // define close rooms as any room within ~10 miles of user
      if (distance < 16) {
        closeRooms.push(chatRoom);
      }
    }
    return closeRooms;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const createRoom = async (name) => {
    setIsOpen(false);
    const { chatRoom } = await api.post('/chat_rooms', { name, lat, long });
    setChatRooms([...chatRooms, chatRoom]);
    setNewRoom(chatRoom);
  };

  if (newRoom) {
    // couldn't figure out how to auto redirect to the new chat room in time
  }

  return (
    <div className="app-container">
      <Rooms>
        {chatRooms.map((room) => {
          return (
            <Room key={room.id} to={`chat_rooms/${room.id}`}>
              {room.name}
            </Room>
          );
        })}
        <Room action={() => setIsOpen(true)}>+</Room>
      </Rooms>
      <div className="chat-window">
        <Routes>
          <Route path="chat_rooms/:id" element={<ChatRoom />} />
          <Route
            path="/*"
            element={
              <>
                <div className="select-room">
                  <div>Select a room or create one to get started</div>
                  <div>(rooms may take a minute to load)</div>
                </div>
              </>
            }
          />
        </Routes>
      </div>
      {isOpen ? <NewRoomModal createRoom={createRoom} closeModal={() => setIsOpen(false)} /> : null}
    </div>
  );
};
