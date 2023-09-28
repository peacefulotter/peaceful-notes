import { CustomBold, CustomBoldItalic, CustomCode, CustomCodeblock, CustomH1, CustomH2, CustomH3, CustomItalic, CustomLi, CustomMath, CustomNumberUl, CustomUl } from "@/parser/components";
import { Builder } from './types';
import Parser from ".";

type SyntaxChar = {
    token: string
    regex?: boolean
    newLine?: boolean
}

export const Syntax: Record<string, SyntaxChar> = {
    H1: { token: '#', newLine: true },
    H2: { token: '##', newLine: true },
    H3: { token: '###', newLine: true },
    Code: { token: '`'  },
    Codeblock: { token: '``', newLine: true },
    MathInline: { token: '@' },
    Mathblock: { token: '@@' },
    Li: { token: '-', newLine: true },
    Ul: { token: '--', newLine: true }, // FIXME: Ul not needed anymore unless for stylign?
    Italic: { token: '*' }, 
    Bold: { token: '**' }, 
    BoldItalic: { token: '***' }, 
    NumberUl: { token: '[0-9].', regex: true } ,
} as const

const backspace = '\n'

const syntaxCharacters = Object.values(Syntax) as SyntaxChar[]

export const tokenInSyntax = (token: string, newLine: boolean) => {
    for (let syntax of syntaxCharacters) {
        const { token: syntaxToken, regex, newLine: newLineSyntax } = syntax;
        if (
            (newLineSyntax ? (newLine === newLineSyntax) : true) &&
            (
                (regex && new RegExp(`/^${regex}$/m`).test(token)) ||
                (!regex && token == syntaxToken)
            )
        )
            return true
    }
    return false;
}


// enforce type safety for builders
const createBuilder = <T extends object = {}, U extends object = {}>(builder: Builder<T, U>): Builder<T, U> => builder;

export const syntaxBuilders = {
    [Syntax.H1.token]: createBuilder({ 
        endToken: backspace,
        parseInner: true,  
        node: CustomH1 
    }),
    [Syntax.H2.token]: createBuilder({ 
        endToken: backspace,
        parseInner: true,  
        node: CustomH2 
    }),
    [Syntax.H3.token]: createBuilder({ 
        endToken: backspace, 
        parseInner: true, 
        node: CustomH3 
    }),
    [Syntax.Code.token]: createBuilder({ 
        endToken: Syntax.Code.token, 
        parseInner: false, 
        node: CustomCode 
    }),
    [Syntax.Codeblock.token]: createBuilder({ 
        endToken: Syntax.Codeblock.token, 
        parseInner: false, 
        node: CustomCodeblock,
        props: (parser: Parser) => {
            const node = parser.pullUntil(backspace, false)
            return { 
                language: Array.isArray(node) 
                    ? node.join('').trim() 
                    : undefined 
            }
        } 
    }),
    [Syntax.MathInline.token]: createBuilder({ 
        endToken: backspace, 
        parseInner: false, 
        staticProps: { inline: true }, 
        node: CustomMath 
    }),
    [Syntax.Mathblock.token]: createBuilder({
        endToken: Syntax.Mathblock.token, 
        parseInner: false, 
        staticProps: { inline: false }, 
        node: CustomMath 
    }),
    [Syntax.Li.token]: createBuilder({
        endToken: backspace, 
        parseInner: true, 
        node: CustomLi 
    }),
    [Syntax.Ul.token]: createBuilder({
        endToken: Syntax.Ul.token, 
        parseInner: true, 
        node: CustomUl 
    }),
    [Syntax.NumberUl.token]: createBuilder({
        endToken: backspace, 
        parseInner: true, 
        node: CustomNumberUl
    }),
    [Syntax.Bold.token]: createBuilder({
        endToken: Syntax.Bold.token,
        parseInner: true,
        node: CustomBold,
    }),
    [Syntax.Italic.token]: createBuilder({
        endToken: Syntax.Italic.token,
        parseInner: true,
        node: CustomItalic,
    }),
    [Syntax.BoldItalic.token]: createBuilder({ 
        endToken: Syntax.BoldItalic.token,
        parseInner: true,
        node: CustomBoldItalic,
    })
}