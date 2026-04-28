import { useCallback, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSearchParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import Footer from '../components/Footer';
import { apiFetch } from '../services/apiFetch';
import { getToken } from '../services/auth';

const normalizeBase = (base) => base.replace(/\/+$/, '');

const resolveSocketUrl = () => {
  const rawBase =
    process.env.REACT_APP_SOCKET_URL ||
    process.env.REACT_APP_API_URL ||
    'https://travel-together-backend.onrender.com';
  const base = normalizeBase(rawBase);
  return base.endsWith('/api') ? base.slice(0, -4) : base;
};

const SOCKET_URL = resolveSocketUrl();

function Chat() {
  const [searchParams] = useSearchParams();
  const featureName = searchParams.get('feature') || 'MirrorTrip';
  const socketRef = useRef(null);
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState('');
  const [activeTripId, setActiveTripId] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [memberCounts, setMemberCounts] = useState({});
  const [error, setError] = useState('');

  const token = getToken();

  const getTripMemberCount = useCallback((trip) => {
    if (trip && typeof trip.joinedCount === 'number') {
      return trip.joinedCount;
    }
    if (trip && Array.isArray(trip.members)) {
      return trip.members.length;
    }
    return 0;
  }, []);

  const formatTripDate = useCallback((value) => {
    if (!value) return '--';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return String(value);
    return parsed.toLocaleDateString();
  }, []);

  useEffect(() => {
    if (!token) {
      setError('Please log in to access chat.');
      return;
    }

    const socket = io(SOCKET_URL, {
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('connect_error', (err) => {
      setError(err?.message || 'Failed to connect chat');
    });

    socket.on('chatError', (payload) => {
      setError(payload?.message || 'Chat error');
    });

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => {
        const exists = prev.some((item) => item._id && item._id === data._id);
        if (exists) {
          return prev;
        }
        return [...prev, data];
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  useEffect(() => {
    const loadTrips = async () => {
      if (!token) {
        setIsLoadingTrips(false);
        return;
      }

      try {
        setIsLoadingTrips(true);
        const data = await apiFetch('/trips');
        const safeTrips = Array.isArray(data) ? data : [];
        setTrips(safeTrips);
        setMemberCounts(
          safeTrips.reduce((acc, trip) => {
            acc[trip._id] = getTripMemberCount(trip);
            return acc;
          }, {})
        );
      } catch (err) {
        setError(err?.message || 'Failed to load trips');
      } finally {
        setIsLoadingTrips(false);
      }
    };

    loadTrips();
  }, [getTripMemberCount, token]);

  const loadMessages = async (selectedTripId) => {
    try {
      setIsLoadingMessages(true);
      setError('');
      const data = await apiFetch(`/messages/${selectedTripId}`);
      setMessages(data || []);
    } catch (err) {
      setMessages([]);
      setError(err?.message || 'Failed to load messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const joinTrip = async () => {
    if (!tripId.trim() || !socketRef.current) {
      return;
    }

    const normalizedTripId = tripId.trim();

    try {
      setError('');
      const joinResult = await apiFetch(`/trips/join/${normalizedTripId}`, {
        method: 'POST',
      });

      if (typeof joinResult?.joinedCount === 'number') {
        setMemberCounts((prev) => ({
          ...prev,
          [normalizedTripId]: joinResult.joinedCount,
        }));
        setTrips((prev) =>
          prev.map((item) =>
            item._id === normalizedTripId ? { ...item, joinedCount: joinResult.joinedCount } : item
          )
        );
      }
    } catch (err) {
      const status = err?.status;
      if (status !== 400) {
        setError(err?.message || 'Failed to join trip');
        return;
      }
    }

    socketRef.current.emit('joinTrip', normalizedTripId);
    setActiveTripId(normalizedTripId);
    await loadMessages(normalizedTripId);
  };

  const sendMessage = () => {
    if (!message.trim() || !activeTripId || !socketRef.current) {
      return;
    }

    const payload = {
      tripId: activeTripId,
      message: message.trim(),
    };

    socketRef.current.emit('sendMessage', payload);
    setMessage('');
  };

  const handleJoinKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      joinTrip();
    }
  };

  const handleMessageKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className='fg-page min-h-screen px-4 py-12'>
      <div className='fg-orb fg-orb-1' aria-hidden='true' />
      <div className='fg-orb fg-orb-2' aria-hidden='true' />
      <div className='fg-page-content mx-auto w-full max-w-4xl fg-rise'>
        <div className='mb-8 flex flex-wrap items-start justify-between gap-4'>
          <div>
            <p className='fg-kicker text-xs font-semibold uppercase'>{featureName}</p>
            <h2 className='fg-title mt-3 text-3xl font-bold'>{featureName}</h2>
            <p className='fg-muted mt-2 text-sm'>Coordinate plans with your travel crew.</p>
          </div>
          <BackButton />
        </div>

        <div className='fg-section'>
          {error && <div className='fg-alert mb-4 px-4 py-3 text-sm'>{error}</div>}

          <div className='flex flex-wrap items-center gap-3'>
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              disabled={isLoadingTrips}
              onKeyDown={handleJoinKeyDown}
              className='fg-input w-full flex-1 text-sm'
            >
              <option value=''>{isLoadingTrips ? 'Loading trips...' : 'Select a trip'}</option>
              {trips.map((trip) => (
                <option key={trip._id} value={trip._id}>
                  {trip.destination} ({formatTripDate(trip.date)})
                </option>
              ))}
            </select>
            <button
              onClick={joinTrip}
              className='fg-btn-primary text-sm transition hover:brightness-110'
            >
              Join
            </button>
            <span className='fg-muted text-xs'>
              {isConnected ? 'Connected' : 'Offline'}
              {activeTripId ? ' • Room joined' : ''}
            </span>
          </div>

          {activeTripId && (
            <div className='mt-3 text-xs font-semibold fg-muted'>
              Members: {memberCounts[activeTripId] ?? '--'}
              {trips.find((trip) => trip._id === activeTripId)?.maxMembers
                ? ` / ${trips.find((trip) => trip._id === activeTripId).maxMembers}`
                : ''}
            </div>
          )}

          <div className='fg-card mt-6 h-72 overflow-y-auto p-4'>
            {isLoadingMessages ? (
              <p className='fg-muted text-sm'>Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className='fg-muted text-sm'>No messages yet. Join a trip and say hello.</p>
            ) : (
              <div className='space-y-3 text-sm'>
                {messages.map((msg, index) => (
                  <div key={`msg-${index}`} className='fg-title'>
                    <span>
                      <span className='font-semibold'>
                        {msg.senderId?.name || msg.senderName || 'Traveler'}:
                      </span>{' '}
                      {msg.text || msg.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='mt-4 flex gap-3'>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder='Type a message'
              disabled={!activeTripId}
              onKeyDown={handleMessageKeyDown}
              className='fg-input w-full flex-1 text-sm'
            />
            <button
              onClick={sendMessage}
              disabled={!activeTripId}
              className='fg-btn-primary text-sm transition hover:brightness-110'
            >
              Send
            </button>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Chat;
