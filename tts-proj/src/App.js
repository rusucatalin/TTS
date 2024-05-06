import { Routes, Route } from 'react-router-dom';
import {RegisterPage} from "./Components/Register";
import {LoginPage} from "./Components/Login";




function App() {
  return (
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>
  );
}

export default App;
