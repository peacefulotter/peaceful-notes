import { PropsWithChildren } from "react";

export type Editor = string;
export type Key = string;
export type Line = [Key, string]

export type CompositeProps<T> = PropsWithChildren<T>
export type BasicProps = CompositeProps<any>