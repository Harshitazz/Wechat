import './App.css';
import {  Route, Routes}from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage';
import JitsiRoomPage from './Pages/JitsiRoomPage';
function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<HomePage/>} exact />
    <Route path="/chats" element={<ChatPage/>} />
    <Route path="/room/:roomId" element={<JitsiRoomPage/>} />

    </Routes>
  </div>
  );
}

export default App;
