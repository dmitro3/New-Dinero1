'use client';
import { coins, usd } from '@/assets/svg';
import { dateFormatter, truncateDecimals } from '@/lib/utils';
import Image from 'next/image';

const CustomTableCard = ({ controls = [], data = [] }) => {
  function formatCreatedAt(dateString) {
    return dateFormatter(dateString, {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  }

  function calculateMultiplier(winAmount, betAmount) {
    if (!winAmount || !betAmount || betAmount === 0) return '-';
    return truncateDecimals(winAmount / betAmount, 5);
  }

  return (
    <div className="overflow-x-auto scrollable-Content">
      <table className="bg-[hsl(var(--background))] rounded w-full text-left border-collapse">
        <thead>
          <tr>
            {controls.map((item) => (
              <th
                key={item.label}
                className="p-4 text-white text-[14px] border-b text-center max-w-[160px]"
              >
                {item.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((valueItem, rowIndex) => (
            <tr
              key={
                `${valueItem?.casino_game_id}-${valueItem?.game_round_id}-${rowIndex}` ||
                rowIndex
              }
              className="odd:bg-[rgb(var(--secondary-btn-color))]"
            >
              {controls.map((item) => (
                <td
                  key={item.label}
                  suppressHydrationWarning
                  className="p-4 text-slate-50 text-sm border-b text-center max-w-[160px]"
                >
                  {item.value === 'created_at' ? (
                    formatCreatedAt(valueItem?.[item.value])
                  ) : item.isDynamic && item.value === 'multiplier' ? (
                    calculateMultiplier(
                      valueItem?.win_amount,
                      valueItem?.bet_amount
                    )
                  ) : item.isAmount ? (
                    <div className="flex gap-1 justify-center text-center">
                      <span className="whitespace-nowrap">
                        {valueItem?.[item.value] || '-'}
                      </span>
                      <Image
                        src={valueItem.currency_code === 'gc' ? coins : usd}
                        alt="coins"
                        width={20}
                        height={20}
                      />
                    </div>
                  ) : (
                    valueItem?.[item.value] || '-'
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTableCard;
