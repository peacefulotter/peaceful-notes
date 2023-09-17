import { PropsWithChildren } from "react";

export type Editor = string;
export type Token = string;
export type Line = Token[]

export type CompositeProps<T> = PropsWithChildren<T>
export type BasicProps = CompositeProps<{}>
export type StringProps = CompositeProps<{v: string}>
export type MathProps = CompositeProps<{v: string, inline: boolean}>