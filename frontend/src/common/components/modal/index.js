/* eslint-disable no-undef */
'use client';
import { useEffect, useRef } from 'react';
import style from './style.module.scss';

const Modal = ({
    isOpen = false,
    closeModal = () => { },
    children = null,
    isOuterClick = true,
    isClosable = true,
    childStyles = {},
    isFullscreen = false,
}) => {
    const modalRef = useRef(null);

    const closeOnOverlayClick = (e) => {
        if (
            isOuterClick &&
            modalRef.current &&
            !modalRef.current.contains(e.target)
        ) {
            closeModal();
        }
    };

    useEffect(() => {
        if (typeof window === 'undefined') return;
        
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.body.style.height = '100vh';
        } else {
            document.body.style.overflow = '';
            document.body.style.height = '';
        }

        return () => {
            document.body.style.overflow = '';
            document.body.style.height = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className={`${style.modalOverlay} ${isFullscreen ? style.fullScreenOverlay : ''}`}
            onClick={closeOnOverlayClick}
        >
            <div
                ref={modalRef}
                className={`${style.modalContent} ${isFullscreen ? style.fullScreen : ''} ${style.mobileBottomSheet}`}
                style={childStyles}
            >
                {isClosable && (
                    <div className={style.closeButton} onClick={closeModal}>
                        ×
                    </div>
                )}
                {children}
            </div>
        </div>
    );
};

export default Modal;
