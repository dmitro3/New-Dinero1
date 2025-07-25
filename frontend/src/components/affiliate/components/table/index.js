'use strict';

import { isEmpty } from '@/lib/utils';
import RefTableHeader from '../tableHeader';
import CustomNoDataFound from '@/common/components/custom-noData';

const RefTable = ({ controls = [], data = [], activeTab, setActiveTab }) => {
  return (
    <div className="flex flex-col w-full text-gray-300 rounded-lg p-4">
      <RefTableHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      {isEmpty(data) ? (
        <CustomNoDataFound className="h-[200]" />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-sm">
            {/* Table Header */}
            <thead>
              <tr className="text-gray-400">
                {controls.map((item) => (
                  <th key={item.label} className="px-4 py-2 text-center">
                    {item.label}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Table Body */}
            <tbody>
              {data.map((valueItem, index) => (
                <tr
                  key={index}
                  className={`${index % 2 === 0 ? 'bg-[hsl(var(--side-bar-card))]' : 'bg-[rgb(var(--lb-blue-900))] '}`}
                >
                  {controls.map((item) => (
                    <td key={item.label} className="px-4 py-2 text-center">
                      {valueItem?.[item?.value]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RefTable;
