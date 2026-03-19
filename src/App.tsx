import Chat from './components/Chat';

function App() {
  return (
    <main className="app-main">
      <header className="app-header">
        <h1 className="app-title">
          Agente Especialista na MSEP
        </h1>
        <p className="app-subtitle">
          Desenvolvido por Carlos Roque com recursos do AI Foundry Agents e Antigravity
        </p>
      </header>

      <Chat />
    </main>
  );
}

export default App;
