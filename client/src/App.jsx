import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import Avatar from './pages/Avatar';
import "./styles.css";
import { Navigate } from 'react-router-dom';

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/chat' element={<Chat></Chat>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/avatar' element={<Avatar></Avatar>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
