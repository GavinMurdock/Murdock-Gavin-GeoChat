import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ApiContext } from '../../utils/api_context';
import { useMessages } from '../../utils/use_messages';
import { Message } from './message';

export const ChatRoom = () => {
  const [chatRoom, setChatRoom] = useState(null);
  const [contents, setContents] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const api = useContext(ApiContext);
  const { id } = useParams();
  const [messages, sendMessage] = useMessages(chatRoom);

  useEffect(async () => {
    setLoading(true);
    if (!user) {
      const { user } = await api.get('/users/me');
      setUser(user);
    }
    const { chatRoom } = await api.get(`/chat_rooms/${id}`);
    setChatRoom(chatRoom);
    setLoading(false);
  }, [id]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="chat-container">
      <div className="messages">
        {[...messages].reverse().map((message) => (
          <Message key={messages.indexOf(message)} message={message} />
        ))}
      </div>
      <div className="chat-input">
        <input type="text" value={contents} onChange={(e) => setContents(e.target.value)} />
        <button
          className="my-button"
          onClick={() => {
            sendMessage(contents, user);
            setContents('');
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};
