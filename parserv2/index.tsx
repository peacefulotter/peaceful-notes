
import { 
    CustomBr, CustomCode, CustomCodeBlock, 
    CustomH1, CustomH2, CustomH3, 
    CustomMath, CustomLi, CustomNothing, 
    CustomParagraph, CustomUl 
} from "@/parser/components";
import { BasicProps } from "@/parser/types";
import { Line, Editor, Token } from "@/parserv2/types";
import Tokens from '@/parserv2/tokens'
import { FC, ReactNode } from "react";



const titles = [
    CustomH1, CustomH2, CustomH3
]

// Builder: 

/*
 builders: {
    token: 
}
*/

type HandlerWithoutProps = {
    nodeBuilder: (children?: ReactNode) => ReactNode;
    endToken: Token;
}

type HandlerWithProps<T> = {
    tokenBuilder: () => T;
    nodeBuilder: (t: T, children?: ReactNode) => ReactNode;
    endToken: Token;
} 

// type Handler = HandlerWithProps<any> | HandlerWithoutProps

type TokenBuilder<T> = () => T;
type PropsBuilder<U> = () => U;
type NodeBuilder<U> =  (u: U, children?: ReactNode) => ReactNode
interface Builders<T, U extends T> {
    token?: TokenBuilder<T>
    props?: PropsBuilder<U>
    node: NodeBuilder<U>
}

type Handler<T, U extends T> = {
    endToken: Token;
    builders: Builders<T, U>
}

type GenericHandler = Handler<any, any>


// const handlerHasProps = (handler: Handler): handler is HandlerWithProps<any> => {
//     return (handler as HandlerWithProps<any>).tokenBuilder !== undefined;
// }

export default class ParserV2 {
    private idx = 0;
    private data: Line;

    // Start Token => [End Token, React Element]
    private SimpleElementMap: Record<Token, [Token, FC<any>]> = {
        '#': ['\n', CustomH1],
        '`': ['`', CustomCode],
    }

    private pullToken(): Token | undefined {
        return this.idx < this.data.length 
            ? this.data[this.idx]  // TODO: ++?
            : undefined
    }

    private titleTokenBuilder(): number {
        if (this.pullToken() === Tokens.Title) {
            this.idx++;
            return 1 + this.titleTokenBuilder()
        }
        return 1
    }

    private titleNodeBuilder(depth: number, children?: ReactNode): ReactNode {
        const Title = titles[Math.max(titles.length - 1, depth)] 
        return <Title key={`title-${this.idx}`}>{children}</Title>
    }

    private titleHandler: Handler<number, number> = {
        endToken: '\n',
        builders: {
            token: this.titleTokenBuilder,
            node: this.titleNodeBuilder,
        }
    }

    private codeNodeBuilder(children?: ReactNode) {
        return <CustomCode key={`code-${this.idx}`}>{children}</CustomCode>
    }

    private codeHandler: Handler<unknown, unknown> = {
        endToken: Tokens.Code,
        builders: {
            node: (_, children) => this.codeNodeBuilder(children)
        }
    }

    // Some tokens require to be built because they consist of multiple tokens (e.g. titles ###)
    private TokenHandlers: Record<Token, GenericHandler> = {
        [Tokens.Title]: this.titleHandler,
        [Tokens.Code]: this.codeHandler
    }

    // private ComplexElementMap: Record<Token, (i: number) => ReactNode> = {
    //     '-': (line: Line) => {
    //         const lines = this.requestLineUntil( ([key, _]) => key !== '-' )
    //         const vals = [line, ...lines].map( ([_, val]) => val ).filter( val => val !== undefined )
    //         const list = Parser.fromArray(vals).parse()
    //         console.log(list);
    //         const elts = list.map((elt, i) => <CustomLi key={`li-${this.acc.length}-${i}`}>{elt}</CustomLi>)
    //         this.createElt(CustomUl, elts)
    //     },
    //     '```': ([_, val]: Line) => {
    //         const lines = this.requestLineUntil( ([key, _]) => key === '```' )
    //         const str = (val ? val + '\n' : '') + lines.map(([k, v]) => k + ' ' + v).join('\n')
    //         this.createElt(CustomCodeBlock, str)
    //     },
    //     '[': ([_, val]: Line) => {

    //     },
    //     '@': ([_, v]: Line) => this.createEltWithProps(CustomMath, {v, inline: true}),
    //     '@@': ([_, v]: Line) => this.createEltWithProps(CustomMath, {v, inline: false}),
    // }

    constructor(editor: Editor) {
        console.log('==================================================');
        this.data = editor
            .split(/(\n)/g) // split by line-break (\n)
            .map( line => line.split('') ) // turn into tokens
            .flat();
        console.log(this.data);
    }

    private parseUntil(i: number, until: string): ReactNode {
        this.idx = i;
        const acc = []
        while (this.idx < this.data.length && this.data[this.idx] !== until) {
            // console.log(JSON.stringify(`>> parseUntil( i=${i}, until=${until} )`), this.idx, this.data[this.idx]);
            const node = this.parseToken(this.idx, until)
            if ( node !== undefined )
                acc.push(node)
            this.idx++
        }
        // console.log('result:', acc);
        return acc.length === 0 ? <p>building...</p> : acc;
    }

    private buildNodeFromHandler(i: number, handler: GenericHandler): ReactNode {
        const { endToken, builders } = handler;
        const props = Object.assign(
            builders.token?.(),
            builders.props?.()
        )
        console.log(builders, props);
        const children = this.parseUntil(i + 1, endToken)
        return builders.node(props, children)
    }
    

    private parseToken = (i: number, until?: string): ReactNode => {
        const token = this.data[i];

        console.log(JSON.stringify(`parseToken( i=${i}, until=${until} )`), this.idx, token);
        if (!token)
            return undefined
        else if (until && token === until) {
            // console.log('found!');
            return undefined
        }
        else if (token === '') {
            this.idx = i;
            return <CustomBr />
        }
        else if ( token in this.TokenHandlers ) {
            // get end token + preparse to get elt
            // parse until end to get children
            const handler = this.TokenHandlers[token]
            return this.buildNodeFromHandler(i, handler)
        }
        // else if (token in this.ComplexElementMap ) {
        //     const Elt = this.ComplexElementMap[token](i)
        //     // Elt FC already called with the appropriate props in the ComplexElementMap value function
        //     return Elt;
        // }
        
        // avoid turning multiple whitespaces into one (that is what HTML (or React?) does) 
        console.log(JSON.stringify(token));
        return token === ' ' ? <>&nbsp;</> : token === '\n' ? <br></br> : token
    }

    parse = (): ReactNode => {
        return this.data.map( (_, i) => {
            // console.log('parse()', i, this.idx);
            if (i >= this.idx)
                return this.parseToken(i)
        } )
    }
}