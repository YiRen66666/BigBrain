import Register from './components/Register';
import Login from './components/Login';
import Dashboard  from './components/Dashboard';
import Defaultpage from './components/Defaultpage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect} from 'react';
import NavBar from './components/NavBar';
import AUTH from './constants';
import EachGame from './components/EditEachGame';
import QuestionPage from './components/QuestionPage';
import GameSessionPage from './components/GameSessionPage';
import PlayerJoinPage from './components/PlayerJoinPage';
import PlayerGamePage from './components/PlayerGamePage';
import PlayerResultPage from './components/PlayerResultPage';
import AdminResultPage from './components/AdminResultPage';

function App() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(localStorage.getItem(AUTH.TOKEN_KEY));
  }, []);
  return (
    <Router>
      <NavBar token={token} setToken={setToken} />
      <Routes>
        <Route path="/" element={<Defaultpage token={token}/>} />
        <Route path="/register" element={<Register setFunc={setToken}/>} />
        <Route path="/login" element={<Login setFunc={setToken}/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/game/:game_id" element={<EachGame/>} />
        <Route path="/game/:game_id/question/:question_id" element={<QuestionPage />} />
        <Route path="/admin/:game_id/session/:session_id" element={<GameSessionPage />} />
        <Route path="/admin/result/:game_id/session/:session_id" element={<AdminResultPage />} />
        <Route path="/player/join/:game_id/session/:session_id" element={<PlayerJoinPage/>}/>
        <Route path="/player/:player_id/game/:game_id/session/:session_id" element={<PlayerGamePage/>}/>
        <Route path="/result/player/:player_id/game/:game_id/session/:session_id" element={<PlayerResultPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;