import './App.css';
import Home from './pages/Home';
import ChatPage from './pages/ChatPage';

import {Route,Routes,Router } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<ChatPage />} />
        </Routes>
    </div>
  );
}

export default App;
