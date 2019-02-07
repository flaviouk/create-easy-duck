import * as d from './typings/utils';
export declare const createTypes: (type: any) => d.Types;
export declare const createActionCreators: (type: any) => {
    start: () => d.Action;
    reset: () => d.Action;
    finish: (payload: any) => any;
    error: (error: {
        message: string;
    }) => any;
};
export declare const createReducer: (type: any, defaultPayload?: null) => (state: {
    status: {
        isLoading: boolean;
        isLoaded: boolean;
    };
    error: null;
    payload: null;
} | undefined, action: d.Action) => d.ReducerState;
export declare const createDuck: ({ type, defaultPayload, ...rest }: {
    [x: string]: any;
    type: any;
    defaultPayload: any;
}) => {
    type: any;
    action: {
        start: () => d.Action;
        reset: () => d.Action;
        finish: (payload: any) => any;
        error: (error: {
            message: string;
        }) => any;
    };
    reducer: (state: {
        status: {
            isLoading: boolean;
            isLoaded: boolean;
        };
        error: null;
        payload: null;
    } | undefined, action: d.Action) => d.ReducerState;
    selectors: {
        getIsReady: import("reselect").OutputSelector<{}, boolean, (res: any) => boolean>;
        getStatus: import("reselect").OutputSelector<{}, any, (res: any) => any>;
        getPayload: import("reselect").OutputSelector<{}, any, (res: any) => any>;
        getPayloadData: import("reselect").OutputSelector<{}, any, (res: any) => any>;
        getError: import("reselect").OutputSelector<{}, any, (res: any) => any>;
    };
};
