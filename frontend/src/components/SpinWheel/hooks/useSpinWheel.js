import { getAllGCValues, getAllSCValues } from '@/lib/spinWheel.utils';
import {
  enableAssetsPixi,
  pixiApplicationDestroy,
} from '@/pixi-js-scripts/bridge';
import { getSpinWheelData } from '@/services/getRequests';
import { getAccessToken } from '@/services/storageUtils';
import { useStateContext } from '@/store';
import { useEffect, useRef, useState } from 'react';

function useSpinWheel({ isOpen }) {
  const {
    dispatch,
    state: { wheelConfig, spinWheelResult, user },
  } = useStateContext();

  const [spinWheelData, setSpinWheelData] = useState(null);
  const pixiContainerRef = useRef(null);
  const token = getAccessToken();

  const getSpinWheel = async () => {
    try {
      let res = await getSpinWheelData();
      setSpinWheelData(res.data);
      dispatch({ type: 'SET_SPIN_LIST', payload: res.data });
      res = res?.data?.wheelConfiguration;
      const convertedData = {
        sc: getAllSCValues(res),
        gc: getAllGCValues(res),
      };
      dispatch({ type: 'SET_SPIN_WHEEL_DATA', payload: convertedData });
    } catch (error) {
      console.error('Error fetching spin wheel data:', error);
    }
  };

  useEffect(() => {
    if (token) {
      // Fetch data when component mounts
      getSpinWheel();
    }
  }, [token]);
  // Initialize Pixi when wheelConfig is available
  useEffect(() => {
    if (wheelConfig?.gc?.length && isOpen) {
      enableAssetsPixi();
    }
    return () => {
      pixiApplicationDestroy(); // Cleanup Pixi when the dialog is closed
      dispatch({
        type: 'SET_SPIN_WHEEL_RESULT',
        payload: {
          showResult: false,
          gc: '',
          sc: '',
          index: '',
          bonusActivated: false,
        },
      });
    };
  }, [wheelConfig]);

  return {
    pixiContainerRef,
    spinWheelResult,
    spinWheelData,
    user,
  };
}

export default useSpinWheel;
