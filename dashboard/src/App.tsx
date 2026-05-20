import "./App.css";
import HealthCard from "./components/HealthCard";
import PackageSearch from "./components/PackageSearch";
import UpgradableTable from "./components/UpgradableTable";

function App() {
  return (
    <main>
      <header className="page-header">
        <h1>Ubuntu Package Health Dashboard</h1>
        <p>Monitor Ubuntu package status, dependencies, and updates.</p>
      </header>

      <HealthCard />
      <PackageSearch/>
      <UpgradableTable/>
    </main>
  );
}

export default App;