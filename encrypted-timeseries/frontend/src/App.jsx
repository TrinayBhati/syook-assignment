import { useSocket } from './hooks/useSocket';
import { Header } from './components/Header';
import { StatsPanel } from './components/StatsPanel';
import { MessageList } from './components/MessageList';

function App() {
    const { messages, stats, connected } = useSocket();

    return (
        <div className="app">
            <Header connected={connected} />
            <main className="main-content">
                <StatsPanel stats={stats} />
                <MessageList messages={messages} />
            </main>
        </div>
    );
}

export default App;
