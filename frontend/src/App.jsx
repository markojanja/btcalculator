import "./App.css";
import Footer from "./components/Footer";
import Form from "./components/Form";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <main className="main">
        <Form />
      </main>
      <Footer />
    </>
  );
}

export default App;
