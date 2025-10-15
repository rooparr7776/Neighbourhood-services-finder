import React, { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import '../styles/ChatModal.css';

function ChatModal({ bookingId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const token = localStorage.getItem('token');

  const fetchMessages = useCallback(async () => {
    try {
      const res = await api.get(`chat/${bookingId}/messages`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 0);
    } catch (e) {
      // no-op
    }
  }, [bookingId, token]);

  useEffect(() => {
    fetchMessages();
    const id = setInterval(fetchMessages, 2500);
    return () => clearInterval(id);
  }, [fetchMessages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('text', text);
      if (image) form.append('image', image);
      await api.post(`chat/${bookingId}/messages`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setText('');
      setImage(null);
      await fetchMessages();
    } catch (e) {
      // no-op
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-backdrop" onClick={onClose}>
      <div className="chat-modal" onClick={(e) => e.stopPropagation()}>
        <div className="chat-header">
          <span>Chat</span>
          <button className="chat-close" onClick={onClose}>×</button>
        </div>
        <div className="chat-body">
          {messages.map((m) => (
            <div key={m._id} className={`chat-msg ${m.senderRole}`}>
              <div className="chat-bubble">
                <div className="chat-sender" style={{ fontSize: 12, opacity: 0.8, marginBottom: 4 }}>{m.senderName || m.senderRole}</div>
                <div className="chat-text">{m.text}</div>
                {m.image && (
                  <div className="chat-image" style={{ marginTop: 6 }}>
                    <img src={`https://neighbourly-m2st.onrender.com/uploads/${m.image}`} alt="attachment" style={{ maxWidth: '100%', borderRadius: 6 }} />
                  </div>
                )}
                <div className="chat-time">{new Date(m.createdAt).toLocaleTimeString()}</div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <form className="chat-input" onSubmit={sendMessage}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a message"
          />
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} />
          <button type="submit" disabled={loading || (!text.trim() && !image)}>Send</button>
        </form>
      </div>
    </div>
  );
}

export default ChatModal;
