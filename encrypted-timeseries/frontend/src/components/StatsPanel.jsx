export function StatsPanel({ stats }) {
    return (
        <div className="stats-panel">
            <div className="stat-card">
                <h3>Total Received</h3>
                <p className="stat-value">{stats.totalReceived}</p>
            </div>

            <div className="stat-card">
                <h3>Total Valid</h3>
                <p className="stat-value success">{stats.totalValid}</p>
            </div>

            <div className="stat-card">
                <h3>Total Invalid</h3>
                <p className="stat-value error">{stats.totalInvalid}</p>
            </div>

            <div className="stat-card">
                <h3>Success Rate</h3>
                <p className="stat-value">{stats.successRate}%</p>
            </div>
        </div>
    );
}
