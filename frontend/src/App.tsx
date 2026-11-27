import { HealthStatus } from "./components/HealthStatus.tsx";

function App() {
  return (
    <main className="mx-auto max-w-xl p-6">
      <h1 className="text-3xl text-secondary">ForexLedger</h1>
      <div className="mt-4 rounded-control border border-border bg-surface p-4 shadow-card">
        <HealthStatus />
      </div>
    </main>
  );
}

export default App;
