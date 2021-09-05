import { useEffect, useCallback, useRef, RefObject } from 'react';

type Block = 'center' | 'end' | 'nearest' | 'start' | undefined;

export const useScroll = <T extends HTMLElement>(trigger: unknown, block?: Block): RefObject<T> => {
    const scrollRef = useRef<T>(null);
    const scrollToRef = useCallback(() => {
        // eslint-disable-next-line no-unused-expressions
        scrollRef?.current?.scrollIntoView({
            behavior: 'smooth',
            block: block || 'center',
        });
    }, [block]);

    useEffect(() => {
        scrollToRef();
    }, [scrollToRef, trigger]);

    return scrollRef;
};
