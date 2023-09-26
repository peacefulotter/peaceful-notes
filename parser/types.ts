import { PropsWithChildren, ReactNode } from "react";

export type Editor = string;
export type Token = string;
export type Line = Token[]

export type ComplexProps<T> = T extends undefined | null ? PropsWithChildren : PropsWithChildren<T>
export type BasicProps = ComplexProps<undefined>


export type Builder<T = any> = {
    endToken: Token;
    parseInner: boolean;
    node: ({ children, ...props }: ComplexProps<T>) => ReactNode;
} & (
    T extends undefined | null
        ? { props?: T; } 
        : { props: T; }
)
