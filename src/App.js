import { Routes , Route } from 'react-router-dom';
import './App.css';
import Signup from './component/signup';
import Dashboard from './component/dashboard';
import SignIn from './component/signin';
import Listing from './component/dashboard/listing';
import View from './component/view';
import Orders from './component/dashboard/order';

function App() {
  return (
    <div className="App bg-custom-gradient min-h-screen">
      <Routes>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/' element={<Signup />}/>
        <Route path='/signin' element={<SignIn />}/>
        <Route path='/listing' element={<Listing />} />
        <Route path='/books/view/:bookId' element={<View />} />
        <Route path='/orders' element={<Orders />} />
        
        
      </Routes>
    </div>
  );
}

export default App;