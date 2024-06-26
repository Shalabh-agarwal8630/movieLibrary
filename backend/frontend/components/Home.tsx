import { Search } from '../components/Search';
import { Movies } from '../components/Movies';
import FavoriteSidebar from './FavoriteSidebar.tsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

function Home() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const goToPublicPlaylists = () => {
    navigate('/seepublic');
  };
  
  useEffect(() => {
    const userToken = localStorage.getItem('user__token');
    setText(userToken ? 'Logout' : 'Login');
  }, []);

  const logout = () => {
    localStorage.removeItem('user__token');
    navigate('/login');
  };

  return (
    <>
      <div className="z-0 relative w-full h-full flex flex-col justify-center items-center gap-10">
        <div className="flex w-full justify-center items-center gap-10">
          <Search />
          <button
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded"
            onClick={logout}
          >
            {text}
          </button>
          <div>
            <FavoriteSidebar />
            <button
              className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={goToPublicPlaylists}
            >
              See Public Playlists
            </button>
          </div>
        </div>
        <div className="w-5/6">
          <Movies />
        </div>
      </div>
    </>
  );
}

export default Home;
