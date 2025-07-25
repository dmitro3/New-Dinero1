import { noDataTickit, storeBanner } from '@/assets/png';
import { coins, usd, warningIcon } from '@/assets/svg';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import Image from 'next/image';
import CustomCardSkeleton from '@/common/components/custom-card-skeleton';
import { isEmpty } from '@/lib/utils';
import useBuy from '../../hooks/useBuy';
import ConfirmBuyPopupWrapper from '@/components/Stores/component/ConfirmBuyPopupWrapper';

const Buy = ({ handleCloseDialog }) => {
  const renderLoading = () => {
    return (
      <>
        <CustomCardSkeleton rows={2} />
      </>
    );
  };

  const {
    buyPacakageData,
    buyPacakageLoading,
    t,
    router,
    isKycVerified,
  } = useBuy();

  return (
    <>
      {
        isKycVerified ? (
          <div className="">
            <Image
              src={storeBanner}
              alt="store banner image"
              className="my-4 w-[95%] mx-auto"
            />


            {isEmpty(buyPacakageData) && !buyPacakageLoading ? (
              <div className="flex flex-col items-center mt-4 justify-center">
                <Image
                  src={noDataTickit}
                  alt="No data available"
                  width={140}
                  height={140}
                />
                <p className="text-gray-500 mt-2">packages not available</p>
              </div>
            ) : buyPacakageLoading ? (
              renderLoading()
            ) : (
              <>
                <p className="text-green-300 ml-3">{t('treasureChestOffer')}</p>
                <div className="grid grid-cols-2">
                  {buyPacakageData?.map((item) => (
                    <Card
                      key={item.id}
                      className="w-auto max-w-52 m-2 bg-[rgb(var(--lb-blue-600))] text-white border-none"
                    >
                      <CardHeader className="flex flex-row items-center m-0 p-0 bg-blue-900 rounded-t-lg">
                        <Image src={usd} alt="usd image" className="w-5 h-5 m-2" />
                        <p className="text-sm">{`${item.scCoin} ${t('freeSsCash')}`}</p>
                      </CardHeader>
                      <CardContent className="m-0 p-0">
                        <Image
                          src={coins}
                          alt={item?.label}
                          width={200}
                          height={200}
                          className="my-1 mx-auto h-14 w-14"
                        />
                        <p className="text-white font-bold text-center text-sm">
                          {item.gcCoin}
                        </p>
                        <p className="text-white font-bold text-center text-sm">
                          {t('goldCoins')}
                        </p>
                      </CardContent>
                      <CardFooter className="m-0 p-0">
                        <ConfirmBuyPopupWrapper item={item} handleCloseDialog={handleCloseDialog} />
                        {/* <Button className="bg-green-300 hover:bg-green-400 w-screen m-3"
                          onClick={()=>{setSelectedPackage(item);
                                  setActive('confirmBuy');
                          }}>
                    <span className="text-black font-bold">{`$${item.amount}`}</span>
                  </Button> */}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                <p className="text-gray-400 text-center">{t('maxPurchasePerDay')}</p>
              </>
            )}
          </div>
        ) : (
          <div className="border border-red-500 bg-[rgb(var(--lb-blue-900))] text-white text-center p-3 font-semibold m-3">
            <p className="text-2xl flex justify-center items-center">
              <Image src={warningIcon} alt="warning icon" className="mx-2" />
              {t('warning')}:
            </p>
            <p className="my-2" >
              {t('buyAfter')}&nbsp;
              <span
                className="underline cursor-pointer"
                onClick={() => {
                  router.push('/setting?active=verify');
                  handleCloseDialog();
                }}
              >
                {t('settingVeriffStatus')}.
              </span>
            </p>
          </div>
        )
      }
    </>

  );
};

export default Buy;
