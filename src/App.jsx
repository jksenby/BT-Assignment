import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import List from "./components/list";

function App() {
  return (
    <Router>
      <div className="App">
        <Header></Header>
        <Suspense>
          <Routes>
            <Route path="/" element={<List />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
