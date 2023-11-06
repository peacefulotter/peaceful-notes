import {
  CustomBold,
  // CustomBoldItalic,
  CustomCode,
  CustomCodeblock,
  CustomH1,
  CustomH2,
  CustomH3,
  CustomItalic,
  CustomLi,
  CustomMath,
  CustomNumberUl,
  CustomUl,
} from "@/parser/components";
import { TokenSyntax, createTokenSyntax } from "./types";
import Parser from ".";
import { create } from "domain";

export const backspace = /\n/;

export const maxTokenLength = 5; // Update value if some token can match on length >

const createFrameToken = (token: string) => {
  const prefix = token
    .split("")
    .map((t) => "\\" + t)
    .join("");

  return {
    frame: new RegExp(`${prefix}.{0,${maxTokenLength - token.length}}`, "g"),
    token: new RegExp(`${prefix}`, "g"),
  };
};

const Tokens = {
  H1: "#", // /(\#.{0,4})/g,
  H2: "##",
  H3: "###",
  Code: "`",
  Codeblock: "```",
  MathInline: "@",
  Mathblock: "@@",
  Li: "-",
  Ul: "--",
  Italic: "*",
  Bold: "**",
  //  BoldItalic: /(\*\*\*.{0,2})/g,
  //  NumberUl: /([0-9]|[1-9][0-9]\).{0,4})/g,
} as const;

export type Token = keyof typeof Tokens;

function mapObject<T extends string | number | symbol, U, V>(
  obj: Record<T, U>,
  fn: (u: U) => V
): Record<T, V> {
  return Object.keys(obj).reduce((res, key) => {
    res[key as keyof typeof res] = fn(obj[key as keyof typeof obj]);
    return res;
  }, {} as Record<T, V>);
}

export const RegisteredTokens = mapObject(Tokens, createFrameToken);

export const Syntax: Record<Token, TokenSyntax<any, any>> = {
  H1: createTokenSyntax({
    regex: RegisteredTokens.H1,
    newLine: true,
    builder: {
      endToken: backspace,
      parseInner: true,
      node: CustomH1,
    },
  }),
  H2: createTokenSyntax({
    regex: RegisteredTokens.H2,
    newLine: true,
    builder: {
      endToken: backspace,
      parseInner: true,
      node: CustomH2,
    },
  }),
  H3: createTokenSyntax({
    regex: RegisteredTokens.H3,
    newLine: true,
    builder: {
      endToken: backspace,
      parseInner: true,
      node: CustomH3,
    },
  }),
  Code: createTokenSyntax({
    regex: RegisteredTokens.Code,
    builder: {
      endToken: RegisteredTokens.Code.frame,
      parseInner: false,
      node: CustomCode,
    },
  }),
  Codeblock: createTokenSyntax({
    regex: RegisteredTokens.Codeblock,
    newLine: true,
    builder: {
      endToken: RegisteredTokens.Codeblock.frame,
      parseInner: false,
      node: CustomCodeblock,
      props: (parser: Parser) => {
        const node = parser.pullUntil(backspace, false);
        return {
          language: Array.isArray(node) ? node.join("").trim() : undefined,
        };
      },
    },
  }),
  MathInline: createTokenSyntax({
    regex: RegisteredTokens.MathInline,
    builder: {
      endToken: backspace,
      parseInner: false,
      staticProps: { inline: true },
      node: CustomMath,
    },
  }),
  Mathblock: createTokenSyntax({
    regex: RegisteredTokens.Mathblock,
    builder: {
      endToken: RegisteredTokens.Mathblock.frame,
      parseInner: false,
      staticProps: { inline: false },
      node: CustomMath,
    },
  }),
  Li: createTokenSyntax({
    regex: RegisteredTokens.Li,
    newLine: true,
    builder: {
      endToken: backspace,
      parseInner: true,
      node: CustomLi,
    },
  }),
  Ul: createTokenSyntax({
    regex: RegisteredTokens.Ul,
    newLine: true,
    builder: {
      endToken: RegisteredTokens.Ul.frame,
      parseInner: true,
      node: CustomUl,
    },
  }), // FIXME: Ul not needed anymore unless for stylign?
  Italic: createTokenSyntax({
    regex: RegisteredTokens.Italic,
    builder: {
      endToken: RegisteredTokens.Italic.frame,
      parseInner: true,
      node: CustomItalic,
    },
  }),
  Bold: createTokenSyntax({
    regex: RegisteredTokens.Bold,
    builder: {
      endToken: RegisteredTokens.Bold.frame,
      parseInner: true,
      node: CustomBold,
    },
  }),
  // BoldItalic: createTokenSyntax({
  //   regex: RegisteredTokens.BoldItalic,
  //   builder: createBuilder({
  //     endToken: RegisteredTokens.BoldItalic,
  //     parseInner: true,
  //     node: CustomBoldItalic,
  //   }),
  // },
  // NumberUl: createTokenSyntax({
  //   regex: RegisteredTokens.NumberUl,
  //   newLine: true,
  //   builder: createBuilder({
  //     endToken: backspace,
  //     parseInner: true,
  //     node: CustomNumberUl,
  //   }),
  // },
} as const;
