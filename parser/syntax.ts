import { ReactNode } from 'react'
import { CustomBold, CustomBoldItalic, CustomCode, CustomCodeblock, CustomH1, CustomH2, CustomH3, CustomItalic, CustomLi, CustomMath, CustomUl } from "@/parser/components";
import { BasicProps, Token } from './types';
import { ValueOf } from 'next/dist/shared/lib/constants';

export const Syntax = {
    H1: '#',
    H2: '##',
    H3: '###',
    Code: '`',
    Codeblock: '``',
    MathInline: '@',
    Mathblock: '@@',
    Li: '-',
    Ul: '--',
    Italic: '*',
    Bold: '**',
    BoldItalic: '***',
} as const

const backspace = '\n'

export const tokenInSyntax = (token: string) => 
    (Object.values(Syntax) as string[]).includes(token)


export default interface Builder {
    endToken: Token;
    parseInner: boolean;
    staticProps?: any;
    props?: () => any;
    node: ({ children, ...props }: BasicProps) => ReactNode;
}

type SyntaxValues = ValueOf<typeof Syntax> // typeof Syntax[keyof typeof Syntax];

export const syntaxBuilders: Record<SyntaxValues, Builder> = {
    [Syntax.H1]: { 
        endToken: backspace,
        parseInner: true,  
        node: CustomH1 
    },
    [Syntax.H2]: { 
        endToken: backspace,
        parseInner: true,  
        node: CustomH2 
    },
    [Syntax.H3]: { 
        endToken: backspace, 
        parseInner: true, 
        node: CustomH3 
    },
    [Syntax.Code]: { 
        endToken: Syntax.Code, 
        parseInner: false, 
        node: CustomCode 
    },
    [Syntax.Codeblock]: { 
        endToken: Syntax.Codeblock, 
        parseInner: false, 
        node: CustomCodeblock 
    },
    [Syntax.MathInline]: { 
        endToken: backspace, 
        parseInner: false, 
        staticProps: { inline: true }, 
        node: CustomMath 
    },
    [Syntax.Mathblock]: { 
        endToken: Syntax.Mathblock, 
        parseInner: false, 
        staticProps: { inline: false }, 
        node: CustomMath 
    },
    [Syntax.Li]: { 
        endToken: backspace, 
        parseInner: true, 
        node: CustomLi 
    },
    [Syntax.Ul]: { 
        endToken: Syntax.Ul, 
        parseInner: true, 
        node: CustomUl 
    },
    [Syntax.Bold]: {
        endToken: Syntax.Bold,
        parseInner: true,
        node: CustomBold,
    },
    [Syntax.Italic]: {
        endToken: Syntax.Italic,
        parseInner: true,
        node: CustomItalic,
    },
    [Syntax.BoldItalic]: {
        endToken: Syntax.BoldItalic,
        parseInner: true,
        node: CustomBoldItalic,
    }
}