import './App.css';
import {  Route, Routes}from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage';
import RoomPage from './Pages/RoomPage';

function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<HomePage/>} exact />
    <Route path="/chats" element={<ChatPage/>} />
    <Route path="/room/:roomId" element={<RoomPage/>} exact />

    </Routes>
  </div>
  );
}

export default App;
