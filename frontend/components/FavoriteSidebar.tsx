import React, { useState, useEffect } from 'react';
import axios from 'axios';
import FavCard from './FavCard';
// @ts-ignore
import { baseUrl } from '../config/api.js';
import toast from 'react-hot-toast';
import { Oval } from 'react-loader-spinner';

const FavoriteSidebar: React.FC = () => {
  const [playlists, setPlaylists] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlaylists = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('user__token');
        if (!token) return;

        const response = await axios.get(`${baseUrl}/api/movies/favorites/playlists`, {
          headers: {
            authorization: `Bearer ${token}`,
          },
        });
        setPlaylists(response.data.playlists);
      } catch (error) {
        console.error('Error fetching playlists:', error);
        setError('An error occurred while fetching playlists.');
        toast.error('An error occurred while fetching playlists.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, []);

  const handlePlaylistClick = (playlistId: string) => {
    console.log('Playlist clicked:', playlistId);
  };

  const handleDeleteMovie = async (playlistId: string, movieId: string) => {
    try {
      const token = localStorage.getItem('user__token');
      if (!token) return;

      await axios.delete(
        `${baseUrl}/api/movies/favorites/deleteMovie`,
        {
          data: { playlistId, movieId },
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setPlaylists((prevPlaylists) =>
        prevPlaylists.map((playlist) =>
          playlist.id === playlistId
            ? { ...playlist, imdbIDs: playlist.imdbIDs.filter((id) => id !== movieId) }
            : playlist
        )
      );

      toast.success('Movie deleted successfully.');
      // window.location.reload(); // Refresh window after deleting movie
    } catch (error) {
      console.error('Error deleting movie:', error);
      toast.error('An error occurred while deleting the movie.');
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    try {
      const token = localStorage.getItem('user__token');
      if (!token) return;

      await axios.delete(`${baseUrl}/api/movies/favorites/deletePlaylist/${playlistId}`, {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });

      setPlaylists((prevPlaylists) =>
        prevPlaylists.filter((playlist) => playlist.id !== playlistId)
      );

      toast.success('Playlist deleted successfully.');
      // window.location.reload(); // Refresh window after deleting playlist
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('An error occurred while deleting the playlist.');
    }
  };

  return (
    <div className="drawer drawer-end">
      <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content">
        <div className="indicator">
          <label
            htmlFor="my-drawer-4"
            className="capitalize drawer-button btn bg-gray-700 text-white transition duration-300 hover:bg-gray-800"
          >
            See Playlists 💗
          </label>
          <span className="indicator-item badge bg-teal-700 text-white font-bold">
            {playlists.length}
          </span>
        </div>
      </div>
      <div className="drawer-side z-10 min-h-screen">
        <label
          htmlFor="my-drawer-4"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu p-4 w-80 min-h-full bg-gray-900 text-white">
          <span className="text-teal-700 text-3xl font-semibold mb-4">
            <span className="text-teal-500">{playlists.length} </span>
            Playlists 💗
          </span>
          {loading ? (
            <div className="flex justify-center items-center w-full">
              <Oval
                height={40}
                width={40}
                color="#4fa94d"
                visible={true}
                ariaLabel="oval-loading"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
              />
            </div>
          ) : error ? (
            <span className="text-red-500">{error}</span>
          ) : playlists.length > 0 ? (
            playlists.map((playlist: any, index: number) => (
              <li key={index} className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-between">
                <FavCard
                  playlist={playlist}
                  onPlaylistClick={handlePlaylistClick}
                  onDeleteMovie={handleDeleteMovie}
                />
                <button
                  onClick={() => handleDeletePlaylist(playlist.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <span>No playlists yet.</span>
          )}
        </ul>
      </div>
    </div>
  );
};

export default FavoriteSidebar;
