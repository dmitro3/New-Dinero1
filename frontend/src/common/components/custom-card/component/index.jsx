'use client';
import CardContent from './CardContent';
import AnimateCasinoCard from './AnimateCasinoCard';

export default function Card({
  id,
  iconUrl,
  onGameClick,
  isFavorite,
  handleFavoriteGame,
  casinoGameId,
  type = 'casino',
  index,
  t,
  hideFavorite,
  isHomeScreen,
}) {
  return (
    <AnimateCasinoCard id={id} type={type} index={index}>
      <CardContent
        iconUrl={iconUrl}
        onGameClick={onGameClick}
        handleFavoriteGame={handleFavoriteGame}
        casinoGameId={casinoGameId}
        id={id}
        isFavorite={isFavorite}
        t={t}
        hideFavorite={hideFavorite}
        isHomeScreen={isHomeScreen}
      />
    </AnimateCasinoCard>
  );
}
