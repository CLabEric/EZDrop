import NavBar from './components/NavBar'
import Login from './components/Login'
import HomePage from './components/HomePage'
import DashBoard from './components/DashBoard'
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <NavBar />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="dashboard" element={<DashBoard />} />
      </Routes>

    </div>
  );
}

export default App;
