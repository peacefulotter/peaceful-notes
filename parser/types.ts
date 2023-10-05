import { PropsWithChildren, ReactNode } from "react";
import Parser from ".";

export type Editor = string;
export type Token = string;
export type Line = Token[]

export type ComponentProps<T = unknown, U extends object = {}> = 
    PropsWithChildren<T & U>

export type Builder<T extends object = {}, U extends object = {}> = {
    endToken: RegExp;
    parseInner: boolean;
    node: ({ children, ...props }: ComponentProps<T, U>) => ReactNode;
    staticProps?: T;
    props?: (parser: Parser) => U;
}
