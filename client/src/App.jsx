import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Chat from './pages/Chat';
import Login from './pages/Login';
import Register from './pages/Register';
import Avatar from './pages/Avatar';
import "./styles.css";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home></Home>}></Route>
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
