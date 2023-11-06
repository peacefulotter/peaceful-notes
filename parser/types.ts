import { PropsWithChildren, ReactNode } from "react";
import Parser from ".";

export type Editor = string;
export type Frame = string;
export type Line = string[];

export type FrameTokenRegex = {
  frame: RegExp;
  token: RegExp;
};

export type ComponentProps<
  StaticPropsType = void,
  DynamicPropsType = void
> = PropsWithChildren<StaticPropsType & DynamicPropsType>;

interface BaseBuilder<StaticPropsType = void, DynamicPropsType = void> {
  endToken: RegExp;
  parseInner: boolean;
  node: ({
    children,
    ...props
  }: ComponentProps<StaticPropsType, DynamicPropsType>) => ReactNode;
}

type StaticProps<T> = T extends void
  ? { staticProps?: undefined }
  : { staticProps: T };

type DynamicProps<T> = T extends void
  ? { props?: undefined }
  : { props: (parser: Parser) => T };

export type Builder<
  StaticPropsType = void,
  DynamicPropsType = void
> = BaseBuilder<StaticPropsType, DynamicPropsType> &
  StaticProps<StaticPropsType> &
  DynamicProps<DynamicPropsType>;

export type TokenSyntax<StaticPropsType = void, DynamicPropsType = void> = {
  regex: FrameTokenRegex;
  newLine?: boolean;
  builder: Builder<StaticPropsType, DynamicPropsType>;
};

// enforce type safety for the syntax
export const createTokenSyntax = <
  StaticPropsType = void,
  DynamicPropsType = void
>(
  syntax: TokenSyntax<StaticPropsType, DynamicPropsType>
): TokenSyntax<StaticPropsType, DynamicPropsType> => {
  return syntax;
};
