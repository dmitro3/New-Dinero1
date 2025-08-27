import { removeFav } from '@/services/deleteRequest';
import { addFav } from '@/services/postRequest';
import { useStateContext } from '@/store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const useBottom = (gamePlayRef, isFavourite) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { gameId } = useParams();
  const [favSucess, setFavSucess] = useState(isFavourite);

  const {
    state: { user },
  } = useStateContext();

  useEffect(() => {
    setFavSucess(isFavourite);
  }, [isFavourite]);

  
  const enterFullscreen = () => {
    if (!gamePlayRef.current) return;
    const element = gamePlayRef.current;

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen(); 
    }
  };

  
  useEffect(() => {
    const handleFullscreenChange = () => {
      const fullscreenActive =
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        );

      setIsFullscreen(fullscreenActive);

      if (!fullscreenActive && gamePlayRef.current) {
        gamePlayRef.current.style.width = '';
        gamePlayRef.current.style.height = '';
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('msfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('msfullscreenchange', handleFullscreenChange);
    };
  }, [gamePlayRef]);


  const handleFav = async ({ gameId, isFav }) => {
    try {
      if (isFav) {
        await removeFav({
          casinoGameId: parseInt(gameId),
          userId: user?.userId,
        });
      } else {
        await addFav({
          casinoGameId: parseInt(gameId),
          userId: user?.userId,
        });
      }
      setFavSucess(!favSucess);
    } catch (error) {
      console.log('Fav error:', error);
    }
  };

  const handleFavoriteGame = () => {
    handleFav({ gameId, isFav: favSucess });
  };

  return {
    isFullscreen,
    toggleFullscreen, 
    handleFavoriteGame,
    favSucess,
  };
};

export default useBottom;
