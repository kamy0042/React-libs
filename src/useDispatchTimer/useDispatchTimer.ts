import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

type ReduxActionCreator<T> = ActionCreatorWithPayload<T, string>;

type Payload<T> = T[];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const useDispatchTimer = <T>(
    actionCreator: ReduxActionCreator<T>,
    payload: Payload<T>,
    time?: number,
) => {
    const dispatch = useDispatch();
    const dispatchers = () => payload.map((item) => dispatch(actionCreator(item)));

    useEffect(() => {
        const timer = setTimeout(() => {
            // eslint-disable-next-line no-void
            void Promise.all(dispatchers());
        }, time || 5000);

        return () => {
            clearTimeout(timer);
        };
    });
};
