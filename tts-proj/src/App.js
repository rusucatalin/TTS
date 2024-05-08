import { Routes, Route } from 'react-router-dom';
import {RegisterPage} from "./Components/Register.jsx";
import {LoginPage} from "./Components/Login.jsx";
import {MainPage} from "./Components/Main.jsx";

function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/" element={<MainPage />}/>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
  );
}

export default App;
