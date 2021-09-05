import { ActionCreatorWithPayload } from '@reduxjs/toolkit';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

type Creator = ActionCreatorWithPayload<undefined, string>;

export const useUnmountState = (actionCreator: Creator) => {
    const dispatch = useDispatch();

    useEffect(
        () => () => {
            dispatch(actionCreator(undefined));
        },
        [actionCreator, dispatch],
    );
};
