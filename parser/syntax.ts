import { CustomBold, CustomBoldItalic, CustomCode, CustomCodeblock, CustomH1, CustomH2, CustomH3, CustomItalic, CustomLi, CustomMath, CustomNumberUl, CustomUl } from "@/parser/components";
import { Builder, Token } from './types';
import Parser from ".";

type SyntaxChar<T extends object = {}, U extends object = {}> = {
    regex: RegExp
    newLine?: boolean
    builder: Builder<T, U>
}

export const backspace = /\n/

// enforce type safety for builders
const createBuilder = <T extends object = {}, U extends object = {}>(builder: Builder<T, U>): Builder<T, U> => builder;


const RegisteredTokens = {
    H1: /(\#.{0,4})/g,
    H2: /(\#\#.{0,3})/g,
    H3: /(\#\#\#.{0,2})/g,
    Code: /(\`.{0,4})/g,
    Codeblock: /(\`\`.{0,3})/g,
    MathInline:  /(\@.{0,4})/g,
    Mathblock: /(\@\@.{0,3})/g,
    Li: /(\-.{0,4})/g,
    Ul: /(\-\-.{0,3})/g,
    Italic: /(\*.{0,4})/g,
    Bold: /(\*\*.{0,3})/g,
    BoldItalic: /(\*\*\*.{0,2})/g,
    NumberUl: /([0-9]|[1-9][0-9].{0,4})/g
} as const

export const Syntax: Record<any, SyntaxChar<any, any>> = {
    H1: { 
        regex: RegisteredTokens.H1, 
        newLine: true,
        builder: createBuilder({ 
            endToken: backspace,
            parseInner: true,  
            node: CustomH1 
        })
    },
    H2: { 
        regex: RegisteredTokens.H2, 
        newLine: true,
        builder: createBuilder({ 
            endToken: backspace,
            parseInner: true,  
            node: CustomH2 
        }) 
    },
    H3: { 
        regex: RegisteredTokens.H3, 
        newLine: true,
        builder: createBuilder({ 
            endToken: backspace, 
            parseInner: true, 
            node: CustomH3 
        })
    },
    Code: { 
        regex: RegisteredTokens.Code,
        builder: createBuilder({ 
            endToken: RegisteredTokens.Code, 
            parseInner: false, 
            node: CustomCode 
        })
    },
    Codeblock: { 
        regex: RegisteredTokens.Codeblock, 
        newLine: true,
        builder: createBuilder({ 
            endToken: RegisteredTokens.Codeblock, 
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
        })
    },
    MathInline: { 
        regex: RegisteredTokens.MathInline,
        builder: createBuilder({ 
            endToken: backspace, 
            parseInner: false, 
            staticProps: { inline: true }, 
            node: CustomMath 
        }) 
    },
    Mathblock: { 
        regex: RegisteredTokens.Mathblock,
        builder: createBuilder({
            endToken: RegisteredTokens.Mathblock, 
            parseInner: false, 
            staticProps: { inline: false }, 
            node: CustomMath 
        })
    },
    Li: { 
        regex: RegisteredTokens.Li, 
        newLine: true,
        builder: createBuilder({
            endToken: backspace, 
            parseInner: true, 
            node: CustomLi 
        })
    },
    Ul: { 
        regex: RegisteredTokens.Ul, 
        newLine: true,
        builder: createBuilder({
            endToken: RegisteredTokens.Ul, 
            parseInner: true, 
            node: CustomUl 
        }),
    }, // FIXME: Ul not needed anymore unless for stylign?
    Italic: { 
        regex: RegisteredTokens.Italic,
        builder: createBuilder({
            endToken: RegisteredTokens.Italic,
            parseInner: true,
            node: CustomItalic,
        })
    }, 
    Bold: { 
        regex: RegisteredTokens.Bold,
        builder: createBuilder({
            endToken: RegisteredTokens.Bold,
            parseInner: true,
            node: CustomBold,
        })
    }, 
    BoldItalic: { 
        regex: RegisteredTokens.BoldItalic,
        builder: createBuilder({ 
            endToken: RegisteredTokens.BoldItalic,
            parseInner: true,
            node: CustomBoldItalic,
        })
    }, 
    NumberUl: { 
        regex: RegisteredTokens.NumberUl, 
        newLine: true,
        builder: createBuilder({ 
            endToken: backspace,
            parseInner: true,
            node: CustomNumberUl,
        })
    } ,
} as const

export const maxLengthPrefix = 5 // Update value if some token can match on length > 

export type SyntaxId = keyof typeof Syntax 

export const tokenInSyntax = (token: Token, newLine: boolean) => {
    for (let syntax of Object.values(Syntax)) {
        const { regex, newLine: newLineSyntax } = syntax;
        if (
            (newLineSyntax ? (newLine === newLineSyntax) : true) &&
            regex.test(token)
        )
            return true
    }
    return false;
}