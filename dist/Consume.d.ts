/// <reference types="react" />
declare const Consume: ({ Consumer, Loading, Error, children, }: {
    Consumer: any;
    Loading?: (() => null) | undefined;
    Error?: (() => null) | undefined;
    children: any;
}) => JSX.Element;
export default Consume;
