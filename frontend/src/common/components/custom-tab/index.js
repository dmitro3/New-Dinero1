'use client';

import Image from 'next/image';
import style from './style.module.scss';
import { useState, useRef, useEffect } from 'react';

const Tabs = ({ options = [], active, setActive = () => { } }) => {
    const containerRef = useRef(null);
    const [sliderStyle, setSliderStyle] = useState({ transform: 'translateX(5px)', width: '0px' });

    useEffect(() => {
        const calculateSliderStyle = () => {
            if (containerRef.current) {
                const tabElements = Array.from(containerRef.current.querySelectorAll('.tabs_value'));
                const activeIndex = options.findIndex(option => option.value === active);
                const cumulativeWidth = tabElements.slice(0, activeIndex).reduce((acc, elem) => acc + elem.clientWidth, 0);

                setSliderStyle({
                    transform: `translateX(${cumulativeWidth}px)`,
                    width: `${tabElements[activeIndex]?.clientWidth}px`,
                });
            }
        };

        calculateSliderStyle();
    }, [active, options]);

    return (
        <div className={`${style.tabContainer} bg-[rgb(var(--lb-blue-800))]`} ref={containerRef}>
            <div
                className={style.activeSlider}
                style={sliderStyle}

            />
            {options.map((item) => {
                return (
                    <div
                        key={item.value}
                        className={`tabs_value ${style.tabsValue} ${item.value === active ? style.active : ''}`}
                        onClick={(e) => {
                            setActive(item.value);
                            e.currentTarget.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }}
                    >
                        {item.icon && (
                            <Image src={item.icon} alt="" width={20} height={20} />
                        )}
                        {item.label} {item.count !== undefined ? (item.count) : ''}
                    </div>
                );
            })}
        </div>
    );
};

export default Tabs;