import { Routes, Route } from 'react-router-dom';
import {RegisterPage} from "./Components/Register";
import {LoginPage} from "./Components/Login";
import {MainPage} from "./Components/Main";


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
