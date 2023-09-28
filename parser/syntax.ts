import { CustomBold, CustomBoldItalic, CustomCode, CustomCodeblock, CustomH1, CustomH2, CustomH3, CustomItalic, CustomLi, CustomMath, CustomUl } from "@/parser/components";
import { Builder } from './types';
import Parser from ".";

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

const syntaxCharacters = Object.values(Syntax) as string[]

export const tokenInSyntax = (token: string) => 
    syntaxCharacters.includes(token)


// enforce type safety for builders
const createBuilder = <T extends object = {}, U extends object = {}>(builder: Builder<T, U>): Builder<T, U> => builder;

export const syntaxBuilders = {
    [Syntax.H1]: createBuilder({ 
        endToken: backspace,
        parseInner: true,  
        node: CustomH1 
    }),
    [Syntax.H2]: createBuilder({ 
        endToken: backspace,
        parseInner: true,  
        node: CustomH2 
    }),
    [Syntax.H3]: createBuilder({ 
        endToken: backspace, 
        parseInner: true, 
        node: CustomH3 
    }),
    [Syntax.Code]: createBuilder({ 
        endToken: Syntax.Code, 
        parseInner: false, 
        node: CustomCode 
    }),
    [Syntax.Codeblock]: createBuilder({ 
        endToken: Syntax.Codeblock, 
        parseInner: false, 
        node: CustomCodeblock,
        props: (parser: Parser) => {
            const node = parser.pullUntil(backspace, false)
            console.log("in props", node);
            return { language: Array.isArray(node) ? node.join('') : undefined }
        } 
    }),
    [Syntax.MathInline]: createBuilder({ 
        endToken: backspace, 
        parseInner: false, 
        staticProps: { inline: true }, 
        node: CustomMath 
    }),
    [Syntax.Mathblock]: createBuilder({
        endToken: Syntax.Mathblock, 
        parseInner: false, 
        staticProps: { inline: false }, 
        node: CustomMath 
    }),
    [Syntax.Li]: createBuilder({
        endToken: backspace, 
        parseInner: true, 
        node: CustomLi 
    }),
    [Syntax.Ul]: createBuilder({
        endToken: Syntax.Ul, 
        parseInner: true, 
        node: CustomUl 
    }),
    [Syntax.Bold]: createBuilder({
        endToken: Syntax.Bold,
        parseInner: true,
        node: CustomBold,
    }),
    [Syntax.Italic]: createBuilder({
        endToken: Syntax.Italic,
        parseInner: true,
        node: CustomItalic,
    }),
    [Syntax.BoldItalic]: createBuilder({ 
        endToken: Syntax.BoldItalic,
        parseInner: true,
        node: CustomBoldItalic,
    })
}