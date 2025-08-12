// /* eslint-disable no-undef */
/* eslint-disable no-undef */
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

  const handleFavoriteGame = () => {
    handleFav({ gameId, isFav: favSucess });
  };

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

    setIsFullscreen(true);
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
    setIsFullscreen(false);
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  };

  // Handle fullscreen state change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(
        !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.msFullscreenElement
        )
      );
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener(
        'webkitfullscreenchange',
        handleFullscreenChange
      );
    };
  }, []);

  // Hide URL bar on mobile rotate
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerWidth > window.innerHeight) {
        // Landscape mode => try to go fullscreen
        enterFullscreen();

        // Small scroll to hide mobile browser UI
        setTimeout(() => {
          window.scrollTo(0, 1);
        }, 300);
      } else {
        // Portrait mode => exit fullscreen
        exitFullscreen();
      }
    };

    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  const handleFav = async ({ gameId, isFav }) => {
    if (isFav) {
      await removeFav({
        casinoGameId: parseInt(gameId),
        userId: user?.userId,
      });
      setFavSucess(!favSucess);
    } else {
      try {
        await addFav({
          casinoGameId: parseInt(gameId),
          userId: user?.userId,
        });
        setFavSucess(!favSucess);
      } catch (error) {
        console.log('error', error);
      }
    }
  };

  return {
    isFullscreen,
    toggleFullscreen,
    handleFavoriteGame,
    favSucess,
  };
};

export default useBottom;

// import { removeFav } from '@/services/deleteRequest';
// import { addFav } from '@/services/postRequest';
// import { useStateContext } from '@/store';
// import { useParams } from 'next/navigation';
// import { useEffect, useState } from 'react';

// const useBottom = (gamePlayRef, isFavourite) => {
//   const [isFullscreen, setIsFullscreen] = useState(false);
//   const { gameId } = useParams();
//   const [favSucess, setFavSucess] = useState(isFavourite);
//   const handleFavoriteGame = () => {
//     handleFav({ gameId, isFav: favSucess });
//   };
//   useEffect(() => {
//     setFavSucess(isFavourite);
//   }, [isFavourite]);

//   const {
//     state: { user },
//   } = useStateContext();
//   const toggleFullscreen = () => {
//     if (typeof window === 'undefined') return;
//     if (!gamePlayRef.current) return;
//     const element = gamePlayRef.current;

//     const enterFullscreen = () => {
//       if (element.requestFullscreen) {
//         element.requestFullscreen();
//       } else if (element.webkitRequestFullscreen) {
//         element.webkitRequestFullscreen();
//       } else if (element.msRequestFullscreen) {
//         element.msRequestFullscreen();
//       } else {
//         // Fallback manual fullscreen styling
//         element.style.transform = 'scale(1)';
//         element.style.width = '100vw';
//         element.style.height = '100vh';
//         element.style.position = 'fixed';
//         element.style.top = '0';
//         element.style.left = '0';
//         element.style.zIndex = '9999';
//         element.style.backgroundColor = '#000';
//         if (typeof document !== 'undefined') {
//           document.body.style.overflow = 'hidden';
//         }
//       }
//       setIsFullscreen(true);
//     };

//     const exitFullscreen = () => {
//       if (typeof document !== 'undefined') {
//         if (document.exitFullscreen) {
//           document.exitFullscreen();
//         } else if (document.webkitExitFullscreen) {
//           document.webkitExitFullscreen();
//         } else {
//           // Remove fallback fullscreen styles
//           element.style.transform = '';
//           element.style.width = '';
//           element.style.height = '';
//           element.style.position = '';
//           element.style.top = '';
//           element.style.left = '';
//           element.style.zIndex = '';
//           element.style.backgroundColor = '';
//           document.body.style.overflow = '';
//         }
//       }
//       setIsFullscreen(false);
//     };
//     if (isFullscreen) {
//       exitFullscreen();
//     } else {
//       enterFullscreen();
//     }
//   };
//   useEffect(() => {
//     if (typeof window === 'undefined') return;
    
//     const handleFullscreenChange = () => {
//       setIsFullscreen(
//         !!(
//           document.fullscreenElement ||
//           document.webkitFullscreenElement ||
//           document.msFullscreenElement
//         )
//       );
//     };

//     document.addEventListener('fullscreenchange', handleFullscreenChange);
//     document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
//     document.addEventListener('msfullscreenchange', handleFullscreenChange);
//     return () => {
//       document.removeEventListener('fullscreenchange', handleFullscreenChange);
//       document.removeEventListener(
//         'webkitfullscreenchange',
//         handleFullscreenChange
//       );
//       document.removeEventListener(
//         'msfullscreenchange',
//         handleFullscreenChange
//       );
//     };
//   }, []);
//   const handleFav = async ({ gameId, isFav }) => {
//     if (isFav) {
//       await removeFav({
//         casinoGameId: parseInt(gameId),
//         userId: user?.userId,
//       });
//       setFavSucess(!favSucess);
//     } else {
//       try {
//         try {
//           await addFav({
//             casinoGameId: parseInt(gameId),
//             userId: user?.userId,
//           });
//           setFavSucess(!favSucess);
//         } catch (error) {
//           console.log('error', error);
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     }
//   };

//   return {
//     isFullscreen,
//     toggleFullscreen,
//     handleFavoriteGame,
//     favSucess,
//   };
// };

// export default useBottom;
