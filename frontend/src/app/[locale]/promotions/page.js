import dynamic from 'next/dynamic';
const Promotions = dynamic(() => import('@/components/promotions/components'));

export default function Page() {
  return (<Promotions />);
}