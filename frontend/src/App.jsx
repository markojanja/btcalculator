import "./App.css";
import Footer from "./components/Footer";
import Header from "./components/Header";
import PipCalculator from "./components/PipCalculator";

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <PipCalculator />
      </main>
      <Footer />
    </>
  );
}

export default App;
