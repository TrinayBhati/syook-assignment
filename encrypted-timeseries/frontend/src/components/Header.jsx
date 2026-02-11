export function Header({ connected }) {
    return (
        <header className="header">
            <h1>Encrypted Timeseries Dashboard</h1>
            <div className="connection-status">
                <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}></span>
                <span>{connected ? 'Connected' : 'Disconnected'}</span>
            </div>
        </header>
    );
}
