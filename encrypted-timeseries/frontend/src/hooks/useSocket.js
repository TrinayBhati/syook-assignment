import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export function useSocket() {
    const [messages, setMessages] = useState([]);
    const [stats, setStats] = useState({
        totalReceived: 0,
        totalValid: 0,
        totalInvalid: 0,
        successRate: 0
    });
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = io(SOCKET_URL);

        socket.on('connect', () => {
            setConnected(true);
        });

        socket.on('disconnect', () => {
            setConnected(false);
        });

        socket.on('message:new', (message) => {
            setMessages((prev) => {
                const updated = [message, ...prev];
                return updated.slice(0, 100);
            });
        });

        socket.on('stats:update', (newStats) => {
            setStats(newStats);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return { messages, stats, connected };
}
