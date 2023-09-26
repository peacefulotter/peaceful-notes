import { PropsWithChildren, ReactNode } from "react";

export type Editor = string;
export type Token = string;
export type Line = Token[]

export type ComponentProps<T = undefined> = T extends undefined | null ? PropsWithChildren : PropsWithChildren<T>

export type Builder<T = any> = {
    endToken: Token;
    parseInner: boolean;
    node: ({ children, ...props }: ComponentProps<T>) => ReactNode;
} & (
    T extends undefined | null
        ? { props?: T; } 
        : { props: T; }
)
