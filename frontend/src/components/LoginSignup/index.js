'use client';
import UserForm from './UserForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { FORGOT_PASSWORD, SIGNIN, SIGNUP } from './constant';
import { getAccessToken } from '@/services/storageUtils';
import { isEmpty } from '@/lib/utils';
import CustomToast from '@/common/components/custom-toaster';
import useSignup from './hooks/useSignup';
import useGeoLocation from '@/common/hook/useGeoLocation';

const US_STATE_NAME_TO_CODE = {
  "Alabama": "AL", "Alaska": "AK", "Arizona": "AZ", "Arkansas": "AR",
  "California": "CA", "Colorado": "CO", "Connecticut": "CT", "Delaware": "DE",
  "Florida": "FL", "Georgia": "GA", "Hawaii": "HI", "Idaho": "ID",
  "Illinois": "IL", "Indiana": "IN", "Iowa": "IA", "Kansas": "KS",
  "Kentucky": "KY", "Louisiana": "LA", "Maine": "ME", "Maryland": "MD",
  "Massachusetts": "MA", "Michigan": "MI", "Minnesota": "MN", "Mississippi": "MS",
  "Missouri": "MO", "Montana": "MT", "Nebraska": "NE", "Nevada": "NV",
  "New Hampshire": "NH", "New Jersey": "NJ", "New Mexico": "NM", "New York": "NY",
  "North Carolina": "NC", "North Dakota": "ND", "Ohio": "OH", "Oklahoma": "OK",
  "Oregon": "OR", "Pennsylvania": "PA", "Rhode Island": "RI", "South Carolina": "SC",
  "South Dakota": "SD", "Tennessee": "TN", "Texas": "TX", "Utah": "UT",
  "Vermont": "VT", "Virginia": "VA", "Washington": "WA", "West Virginia": "WV",
  "Wisconsin": "WI", "Wyoming": "WY"
};

// Blocked states
const BLOCKED_STATES = ["MI", "ID", "WA", "LA", "NV", "MT", "CT", "HI", "DE"];
// Allowed countries
const ALLOWED_COUNTRIES = ["US", "IN"];

function normalizeState(stateCode, stateName) {
  if (stateCode) {
    let code = stateCode.toUpperCase();
    if (code.includes('-')) code = code.split('-').pop();
    return code;
  }
  if (stateName) {
    return US_STATE_NAME_TO_CODE[stateName.trim()] || stateName.toUpperCase();
  }
  return null;
}

function isBlockedRegion(geo) {
  if (!geo) return true;

  const stateCode = normalizeState(geo.state_code, geo.state_name);

  if (!ALLOWED_COUNTRIES.includes(geo.country_code)) return true;
  if (geo.country_code === 'IN') return false;
  if (geo.country_code === 'US' && BLOCKED_STATES.includes(stateCode)) return true;

  return false;
}

const LoginSignup = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const newPasswordKey = searchParams.get('newPasswordKey');

  const token = getAccessToken();
  const [open, setOpen] = useState(isEmpty(token));
  const [isAuthenticated, setIsAuthenticated] = useState(!isEmpty(token));
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [toastState, setToastState] = useState({
    showToast: false,
    message: '',
    status: '',
  });

  const { signupData, signupLoading } = useSignup();
  const location = useGeoLocation();
  const [geoInfo, setGeoInfo] = useState(null);
  const [geoBlock, setGeoBlock] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const hasToken = !isEmpty(getAccessToken());
      setIsAuthenticated(hasToken);
      setOpen(!hasToken);
    };
    checkToken();
    const timeoutId = setTimeout(checkToken, 100);
    window.addEventListener('storage', checkToken);
    window.addEventListener('focus', checkToken);
    const intervalId = setInterval(checkToken, 500);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('focus', checkToken);
    };
  }, [router]);

  useEffect(() => {
    async function fetchGeo() {
      if (location.loaded && !location.error && location.coordinates.lat && location.coordinates.lng) {
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.coordinates.lat}&longitude=${location.coordinates.lng}&localityLanguage=en`
          );
          const data = await res.json();
          const geo = {
            country_code: data.countryCode,
            state_code: data.principalSubdivisionCode?.split('-')[1],
            state_name: data.principalSubdivision,
          };
          setGeoInfo(geo);

          if (isBlockedRegion(geo)) {
            setGeoBlock(true);
            setToastState({
              showToast: true,
              message: 'Access from your region is restricted.',
              status: 'error',
            });
          }
        } catch {}
      }
    }
    fetchGeo();
  }, [location]);

  if (pathname === '/reset-password' && newPasswordKey) {
    return null;
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpen) => isOpen && isAuthenticated && setOpen(isOpen)}
        modal
        className="w-full"
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          className="p-2 border-radius-0 gap-0 w-full sm:w-[800px] max-w-[98%] flex border-none"
        >
          <DialogTitle />
          <DialogHeader className="w-full">
            <div className="flex w-full h-full flex-col sm:flex-row">
              <Tabs defaultValue="signIn" className="w-full sm:w-1/2 p-2 flex flex-col">
                <TabsList className="bg-dark-blue w-full text-gray-400">
                  <TabsTrigger
                    className="w-1/2 py-2 text-center font-semibold aria-selected:text-white aria-selected:text-[22px] aria-selected:border-b-2 aria-selected:border-green-500"
                    value="signUp"
                    style={{ color: '#fff' }}
                    onClick={() => setIsForgotPassword(false)}
                  >
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-1/2 py-2 text-center font-semibold aria-selected:text-white aria-selected:text-[22px] aria-selected:border-b-2 aria-selected:border-green-500"
                    value="signIn"
                    style={{ color: '#fff' }}
                    onClick={() => setIsForgotPassword(false)}
                  >
                    Sign In
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signUp" className="flex-grow p-4">
                  <UserForm
                    controls={SIGNUP}
                    isSignUp
                    setOpen={setOpen}
                    setToastState={setToastState}
                    geoInfo={geoInfo}
                    isBlocked={geoBlock}
                  />
                </TabsContent>

                <TabsContent value="signIn" className="flex-grow p-4">
                  {isForgotPassword ? (
                    <>
                      <p className="text-[rgb(var(--lb-blue-250))] text-[14px] mb-2">
                        Please enter your email. We will send you a reset link.
                      </p>
                      <UserForm
                        controls={FORGOT_PASSWORD}
                        setOpen={setOpen}
                        setIsForgotPassword={setIsForgotPassword}
                        isForgotPassword
                        setToastState={setToastState}
                        geoInfo={geoInfo}
                        isBlocked={geoBlock}
                      />
                    </>
                  ) : (
                    <UserForm
                      controls={SIGNIN}
                      setOpen={setOpen}
                      setIsForgotPassword={setIsForgotPassword}
                      setToastState={setToastState}
                      geoInfo={geoInfo}
                      isBlocked={geoBlock}
                    />
                  )}
                </TabsContent>
              </Tabs>

              <div className="w-1/2 relative justify-center items-center max-[899px]:hidden sm:flex">
                {signupLoading ? (
                  <p className="text-white text-center">Loading banner...</p>
                ) : signupData?.length > 0 ? (
                  signupData.map((banner, index) => (
                    <a
                      key={index}
                      href={banner?.imageUrl || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <img
                        src={banner?.imageUrl || 'https://luckybird.io/img/back.47e88397.png'}
                        alt={`banner-${index}`}
                        className="h-[434px] w-full max-h-[434px] object-cover object-right"
                      />
                    </a>
                  ))
                ) : (
                  <img
                    src="https://luckybird.io/img/back.47e88397.png"
                    alt="default banner"
                    className="h-auto w-full max-h-[434px] object-cover"
                  />
                )}
              </div>
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <CustomToast
        showToast={toastState.showToast}
        setShowToast={(val) => setToastState((prev) => ({ ...prev, showToast: val }))}
        message={toastState.message}
        status={toastState.status}
        duration={2000}
      />
    </>
  );
};

export default LoginSignup;
