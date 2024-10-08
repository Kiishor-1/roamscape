// import './App.css'
// import { Route, Routes } from 'react-router-dom'
// import Home from './pages/Home'
// import NewListing from './pages/NewListing'
// import ShowListing from './pages/ShowListing'
// import EditListing from './pages/EditListing'
// import Navbar from './components/common/Navbar'
// import NotFound from './pages/NotFound'
// import Footer from './components/common/Footer'
// import { Provider } from 'react-redux'
// import store from './store'
// import { useState } from 'react'
// import Login from './pages/Login'
// import Signup from './pages/Signup'
// function App() {
//   const [search, setSearch] = useState('');
//   return (
//     <Provider store={store}>
//       <div className='relative'>
//         <Navbar setSearch={setSearch} />
//         <div className="md:max-w-[1300px] min-h-[71vh] mx-auto">
//           <Routes>
//             <Route path='/' element={<Home search={search} />} />
//             <Route path='/new' element={<NewListing />} />
//             <Route path='/listings/:id' element={<ShowListing />} />
//             <Route path='/listings/edit/:id' element={<EditListing />} />
//             <Route path='signup' element={<Signup />} />
//             <Route path='/login' element={<Login />} />
//             <Route path='*' element={<NotFound />} />
//           </Routes>
//         </div>
//         <Footer />
//       </div>
//     </Provider>
//   )
// }

// export default App



import './App.css';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import NewListing from './pages/NewListing';
import ShowListing from './pages/ShowListing';
import EditListing from './pages/EditListing';
import Navbar from './components/common/Navbar';
import NotFound from './pages/NotFound';
import Footer from './components/common/Footer';
import { Provider } from 'react-redux';
import store from './store';
import { useState } from 'react';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [search, setSearch] = useState('');
  const location = useLocation();

  // Check if the current path is either '/login' or '/signup'
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/dashbord';

  return (
    <Provider store={store}>
      <div className='relative'>
        {!isAuthPage && <Navbar setSearch={setSearch} />}
        <div className={`${isAuthPage ? 'min-w-screen':'md:max-w-[1300px]'} ${isAuthPage ? 'min-h-screen' : 'min-h-[71vh]'} mx-auto`}>
          <Routes>
            <Route path='/' element={<Home search={search} />} />
            <Route path='/new' element={<NewListing />} />
            <Route path='/listings/:id' element={<ShowListing />} />
            <Route path='/listings/edit/:id' element={<EditListing />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/login' element={<Login />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='*' element={<NotFound />} />
          </Routes>
        </div>
        {!isAuthPage && <Footer />}
      </div>
    </Provider>
  );
}

export default App;
