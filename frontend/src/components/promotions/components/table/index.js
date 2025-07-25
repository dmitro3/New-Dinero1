'use client';

import Tabs from '@/common/components/custom-tab';
import CustomTableCard from '@/common/components/custom-table';
import { useState } from 'react';
import { TABLE_CONFIG, TABLE_SELECT_COUNT } from '../../constant';
import CustomSelect from '@/common/components/custom-select';
const options = [
    {
        label: 'My Plays',
        value: 'plays'
    },
    {
        label: 'All',
        value: 'all'
    }, {
        label: 'High Rollers',
        value: 'rollers'
    }, {
        label: 'Rare Win',
        value: 'win'
    },
];

const tableData = [
    {
        game: 'Limbo',
        balance: 200,
        playID: '6964073014',
        amount: 200,
        multiplier: '0.60x',
        result: '-0.011',
        time: '05:01:45 PM'

    },
    {
        game: 'Mermaid',
        balance: 200,
        playID: '6964073011',
        amount: 200,
        multiplier: '0.60x',
        result: '-0.011',
        time: '05:01:45 PM'

    },
    {
        game: 'CoinFlip',
        balance: 200,
        playID: '6964073012',
        amount: 200,
        multiplier: '0.60x',
        result: '-0.011',
        time: '05:01:45 PM'

    },
    {
        game: 'CoinFlip',
        balance: 200,
        playID: '6914073014',
        amount: 200,
        multiplier: '0.60x',
        result: '-0.011',
        time: '05:01:45 PM'

    },
    {
        game: 'Dice',
        balance: 200,
        playID: '6964273014',
        amount: 200,
        multiplier: '0.60x',
        result: '-0.011',
        time: '05:01:45 PM'

    },
];


const TableComponent = () => {
    const [active, setActive] = useState('plays');
    return <div>
        <div className="flex justify-between">
            <Tabs options={options} active={active} setActive={setActive} />
            <CustomSelect options={TABLE_SELECT_COUNT} className="w-[120px]" />
        </div>
        <div className="mt-4">
            <CustomTableCard controls={TABLE_CONFIG} data={tableData} />
        </div>
    </div>;
};
export default TableComponent;