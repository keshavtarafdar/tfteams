import { Routes, Route} from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';
import './App.css';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile/:region/:gameName/:tagLine" element={<Profile />} /> 
      </Routes>
    </div>
  );
};

export default App;