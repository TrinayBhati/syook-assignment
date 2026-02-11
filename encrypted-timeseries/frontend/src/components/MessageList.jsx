export function MessageList({ messages }) {
    const formatTimestamp = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    return (
        <div className="message-list">
            <h2>Recent Messages</h2>
            {messages.length === 0 ? (
                <p className="no-messages">Waiting for messages...</p>
            ) : (
                <div className="messages-container">
                    {messages.map((msg, index) => (
                        <div key={index} className="message-card">
                            <div className="message-content">
                                <span className="message-name">{msg.name}</span>
                                <span className="message-route">
                                    {msg.origin} → {msg.destination}
                                </span>
                            </div>
                            <span className="message-time">{formatTimestamp(msg.receivedAt)}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
