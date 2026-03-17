import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useSearchParams } from "react-router-dom";
import API from "../services/api";
import { getToken } from "../services/auth";

const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || "http://localhost:5001";

function Chat() {
  const [searchParams] = useSearchParams();
  const featureName = searchParams.get("feature") || "MirrorTrip";
  const socketRef = useRef(null);
  const [trips, setTrips] = useState([]);
  const [tripId, setTripId] = useState("");
  const [activeTripId, setActiveTripId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoadingTrips, setIsLoadingTrips] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState("");

  const token = getToken();

  useEffect(() => {
    if (!token) {
      setError("Please log in to access chat.");
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      auth: {
        token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      setError(err?.message || "Failed to connect chat");
    });

    socket.on("chatError", (payload) => {
      setError(payload?.message || "Chat error");
    });

    socket.on("receiveMessage", (data) => {
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
        const res = await API.get("/trips");
        setTrips(res.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load trips");
      } finally {
        setIsLoadingTrips(false);
      }
    };

    loadTrips();
  }, [token]);

  const loadMessages = async (selectedTripId) => {
    try {
      setIsLoadingMessages(true);
      setError("");
      const res = await API.get(`/messages/${selectedTripId}`);
      setMessages(res.data || []);
    } catch (err) {
      setMessages([]);
      setError(err?.response?.data?.message || "Failed to load messages");
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
      setError("");
      await API.post(`/trips/join/${normalizedTripId}`);
    } catch (err) {
      const status = err?.response?.status;
      if (status !== 400) {
        setError(err?.response?.data?.message || "Failed to join trip");
        return;
      }
    }

    socketRef.current.emit("joinTrip", normalizedTripId);
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

    socketRef.current.emit("sendMessage", payload);
    setMessage("");
  };

  return (
    <div className="fg-page min-h-screen px-4 py-12">
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-600">
            {featureName}
          </p>
          <h2 className="fg-title mt-3 text-3xl font-bold">{featureName}</h2>
          <p className="fg-muted mt-2 text-sm">
            Coordinate plans with your travel crew.
          </p>
        </div>

        <div className="fg-glass rounded-3xl p-6 shadow-xl">
          {error && (
            <div className="mb-4 rounded-xl border border-rose-300/60 bg-rose-100/70 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={tripId}
              onChange={(e) => setTripId(e.target.value)}
              disabled={isLoadingTrips}
              className="fg-input w-full flex-1 text-sm"
            >
              <option value="">
                {isLoadingTrips ? "Loading trips..." : "Select a trip"}
              </option>
              {trips.map((trip) => (
                <option key={trip._id} value={trip._id}>
                  {trip.destination} ({trip.date})
                </option>
              ))}
            </select>
            <button
              onClick={joinTrip}
              className="fg-btn-primary text-sm transition hover:brightness-110"
            >
              Join
            </button>
            <span className="fg-muted text-xs">
              {isConnected ? "Connected" : "Offline"}
              {activeTripId ? " • Room joined" : ""}
            </span>
          </div>

          <div className="mt-6 h-72 overflow-y-auto rounded-xl border border-[var(--fg-border)] bg-white/35 p-4">
            {isLoadingMessages ? (
              <p className="fg-muted text-sm">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p className="fg-muted text-sm">
                No messages yet. Join a trip and say hello.
              </p>
            ) : (
              <div className="space-y-3 text-sm">
                {messages.map((msg, index) => (
                  <div key={`msg-${index}`} className="fg-title">
                    <span>
                      <span className="font-semibold">
                        {msg.senderId?.name || msg.senderName || "Traveler"}:
                      </span>{" "}
                      {msg.text || msg.message}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message"
              disabled={!activeTripId}
              className="fg-input w-full flex-1 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!activeTripId}
              className="fg-btn-primary text-sm transition hover:brightness-110"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
