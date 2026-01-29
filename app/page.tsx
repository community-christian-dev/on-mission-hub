import OrbitVisualizer from "./components/OrbitVisualizer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-950">
      <OrbitVisualizer />
    </main>
  );
}