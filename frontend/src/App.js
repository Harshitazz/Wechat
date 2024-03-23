import './App.css';
import { Route, Routes}from 'react-router-dom'
import HomePage from './Pages/HomePage'
import ChatPage from './Pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
    {/* <Route path="/" component={HomePage} exact /> */}
    <Route path="/" element={<HomePage/>} exact />
    <Route path="/chats" element={<ChatPage/>} />
    </Routes>
  </div>
  );
}

export default App;
