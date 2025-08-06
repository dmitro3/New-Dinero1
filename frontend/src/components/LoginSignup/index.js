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
import { useRouter } from 'next/navigation';
import { FORGOT_PASSWORD, SIGNIN, SIGNUP } from './constant';
import { getAccessToken } from '@/services/storageUtils';
import { isEmpty } from '@/lib/utils';
import { usePathname, useSearchParams } from 'next/navigation';
import CustomToast from '@/common/components/custom-toaster';
import useSignup from './hooks/useSignup';
import useGeoLocation from '@/common/hook/useGeoLocation';
// import { jungle } from '@/assets/png';
// import { mobileiImage } from '@/assets/png';

const BLOCKED_REGIONS = [
  { country: 'US', state: 'MI' },
  { country: 'US', state: 'ID' },
  { country: 'US', state: 'WA' },
  { country: 'US', state: 'LA' },
  { country: 'US', state: 'NV' },
  { country: 'US', state: 'MT' },
  { country: 'US', state: 'CT' },
  { country: 'US', state: 'HI' },
  { country: 'US', state: 'DE' },
  // { country: 'IN', state: 'GJ' } // Gujarat for testing 
];
const BLOCKED_COUNTRIES = ['MX'];

function isBlockedRegion(geo) {
  if (!geo) return false;
  if (BLOCKED_COUNTRIES.includes(geo.country_code)) return true;
  // Block by US state
  if (geo.country_code === 'US' && BLOCKED_REGIONS.some(r => r.state === geo.state_code)) return true;
  // Block by India state (Gujarat) (commented out for now)
  // if (
  //   geo.country_code === 'IN' && (
  //     geo.state_code === 'GJ' || geo.state_name === 'Gujarat' || BLOCKED_REGIONS.some(r => r.country === 'IN' && (r.state === geo.state_code || r.state === geo.state_name))
  //   )
  // ) return true;
  return false;
}

const LoginSignup = () => {
  const router = useRouter();
  const isToken = getAccessToken();

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const newPasswordKey = searchParams.get('newPasswordKey');

  const [open, setOpen] = useState(isEmpty(isToken));
  const [isAuthenticated, setIsAuthenticated] = useState(!isEmpty(isToken));
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [toastState, setToastState] = useState({
    showToast: false,
    message: '',
    status: '',
  });

  const { showToast, message, status } = toastState;

  const { signupData, signupLoading } = useSignup();
  const location = useGeoLocation();

  const [geoInfo, setGeoInfo] = useState(null);
  const [geoBlock, setGeoBlock] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = getAccessToken();
      const hasToken = !isEmpty(token);
      
      setIsAuthenticated(hasToken);
      setOpen(!hasToken);
    };

    // Check immediately
    checkToken();

    // Also check after a small delay to handle SSO redirects
    const timeoutId = setTimeout(checkToken, 100);

    return () => clearTimeout(timeoutId);
  }, [router]);

  // Listen for storage changes (when token is added/removed)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = getAccessToken();
      const hasToken = !isEmpty(token);
      
      setIsAuthenticated(hasToken);
      setOpen(!hasToken);
    };

    // Listen for storage events
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom storage events (for same-tab updates)
    window.addEventListener('storage', handleStorageChange);
    
    // Also check when the component mounts and when window gains focus
    const handleFocus = () => {
      handleStorageChange();
    };

    window.addEventListener('focus', handleFocus);

    // Check periodically for token changes (for SSO redirects)
    const intervalId = setInterval(handleStorageChange, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (location.loaded && !location.error) {
      console.log('User geolocation:', location.coordinates);
    }
  }, [location]);

  useEffect(() => {
    async function fetchGeo() {
      if (location.loaded && !location.error && location.coordinates.lat && location.coordinates.lng) {
        try {
          const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.coordinates.lat}&longitude=${location.coordinates.lng}&localityLanguage=en`);
          const data = await res.json();
          const geo = {
            country_code: data.countryCode,
            state_code: data.principalSubdivisionCode ? data.principalSubdivisionCode.split('-')[1] : undefined,
            state_name: data.principalSubdivision,
          };
          setGeoInfo(geo);
          if (isBlockedRegion(geo)) setGeoBlock(true);
        } catch (e) {
          // fallback: do not block
        }
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
        onOpenChange={(isOpen) =>
          isOpen && isAuthenticated && setOpen(isOpen)
        }
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

              {/* ✅ Mobilei Banner Image (only shown on mobilei) */}
              {/* <div className="w-full h-[200px] mb-4 sm:hidden flex justify-center items-center">
  <img
    // src={jungle.src}
    alt="Mobile Banner"
    className="w-full h-full object-cover"
  />
</div> */}

              {/* Left Side: Tabs for Sign Up / Sign In */}
              <Tabs defaultValue="signIn" className="w-full sm:w-1/2 p-2 flex flex-col">
                <TabsList className="bg-dark-blue w-full text-gray-400">
                  <TabsTrigger
                    className="w-1/2 py-2 text-center font-semibold focus:outline-none aria-selected:text-white aria-selected:text-[22px] aria-selected:border-b-2 aria-selected:border-green-500"
                    value="signUp"
                    style={{ color: '#fff' }}
                    onClick={() => setIsForgotPassword(false)}
                  >
                    Sign Up
                  </TabsTrigger>
                  <TabsTrigger
                    className="w-1/2 py-2 text-center font-semibold focus:outline-none aria-selected:text-white aria-selected:text-[22px] aria-selected:border-b-2 aria-selected:border-green-500"
                    value="signIn"
                    style={{ color: '#fff' }}
                    onClick={() => setIsForgotPassword(false)}
                  >
                    Sign In
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="signUp" className="flex-grow p-4">
                  <div className="h-full flex flex-col">
                    <UserForm
                      controls={SIGNUP}
                      isSignUp={true}
                      setOpen={setOpen}
                      setToastState={setToastState}
                      geoInfo={geoInfo}
                      isBlocked={isBlockedRegion(geoInfo)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="signIn" className="flex-grow p-4">
                  <div className="h-full flex flex-col">
                    {isForgotPassword ? (
                      <>
                        <p className="text-[rgb(var(--lb-blue-250))] text-[14px] mb-2">
                          Please enter your email. We will send you a reset link for new password.
                        </p>
                        <UserForm
                          controls={FORGOT_PASSWORD}
                          setOpen={setOpen}
                          setIsForgotPassword={setIsForgotPassword}
                          isForgotPassword={isForgotPassword}
                          setToastState={setToastState}
                          geoInfo={geoInfo}
                          isBlocked={isBlockedRegion(geoInfo)}
                        />
                      </>
                    ) : (
                      <UserForm
                        controls={SIGNIN}
                        setOpen={setOpen}
                        setIsForgotPassword={setIsForgotPassword}
                        setToastState={setToastState}
                        geoInfo={geoInfo}
                        isBlocked={isBlockedRegion(geoInfo)}
                      />
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Right Side: Desktop Banner Image (shown only on desktop) */}
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

      {/* Toast Notification */}
      <CustomToast
        showToast={showToast}
        setShowToast={(val) =>
          setToastState((prev) => ({ ...prev, showToast: val }))
        }
        message={message}
        status={status}
        duration={2000}
      />
    </>
  );
};

export default LoginSignup;
