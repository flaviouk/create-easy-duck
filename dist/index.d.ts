declare type Type = string;
declare type Payload = any;
declare type ErrorMessage = any;
interface Types {
    START: string;
    RESET: string;
    FINISH: string;
    ERROR: string;
}
interface Action {
    type: Type;
    payload?: Payload;
    error?: ErrorMessage;
}
interface ReducerState {
    status: {
        isLoading: boolean;
        isLoaded: boolean;
    };
    error: null;
    payload: null;
}
export declare const createTypes: (type: string) => Types;
export declare const createActionCreators: (type: string) => {
    start: () => Action;
    reset: () => Action;
    finish: (payload: any) => Action;
    error: (error: {
        message: any;
    }) => Action;
};
export declare const createReducer: (type: string, defaultPayload?: null) => (state: {
    status: {
        isLoading: boolean;
        isLoaded: boolean;
    };
    error: null;
    payload: null;
} | undefined, action: Action) => ReducerState;
export declare const createSelectors: (type: string) => {
    getIsReady: import("reselect").OutputSelector<{}, boolean, (res: any) => boolean>;
    getStatus: import("reselect").OutputSelector<{}, any, (res: any) => any>;
    getPayload: import("reselect").OutputSelector<{}, any, (res: any) => any>;
    getPayloadData: import("reselect").OutputSelector<{}, any, (res: any) => any>;
    getError: import("reselect").OutputSelector<{}, any, (res: any) => any>;
};
export {};
