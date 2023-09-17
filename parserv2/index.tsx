
import { Line, Editor, Token } from "@/parserv2/types";
import Tokens from '@/parserv2/tokens'
import { ReactNode } from "react";
import TitleBuilder from "./handlers/TitleBuilder";
import Builder from "./handlers";
import CodeBuilder from "./handlers/CodeBuilder";


export default class ParserV2 {
    idx = 0;
    data: Line;


    // Some tokens require to be built because they consist of multiple tokens (e.g. titles ###)
    private TokenHandlers = {
        [Tokens.Title]: TitleBuilder,
        [Tokens.Code]: CodeBuilder
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

    private parseUntil(until: string): ReactNode {
        const acc = []
        let token = this.pullToken();
        while (token !== undefined && token !== until) {
            console.log(JSON.stringify(`>> parseUntil( until=${until} ), idx=${this.idx}, token: ${JSON.stringify(token)}`));
            const node = this.parseToken(token)
            acc.push(node)
            token = this.pullToken()
        }
        return acc.length === 0 ? <p>building...</p> : acc;
    }

    pullToken(): Token | undefined {
        return this.idx < this.data.length 
            ? this.data[this.idx++]
            : undefined
    }

    private buildNode(builder: Builder): ReactNode {
        const savedIdx = this.idx;
        builder.token?.()
        builder.props?.()
        console.log('building at: ', this.idx);
        const children = this.parseUntil(builder.endToken)
        return builder.node(savedIdx, children)
    }
    

    private parseToken = (token: string): ReactNode => {

        console.log(`parseToken == idx=${this.idx}, token: ${JSON.stringify(token)}`);
        
        if ( token in this.TokenHandlers ) {
            console.log('========= Creating ' + token);
            const BuilderClass = this.TokenHandlers[token]
            const builder = new BuilderClass(this)
            return this.buildNode(builder)
        }
        else if ( token === ' ' )
            return <>&nbsp;</>
        else if ( token === '\n' )
            return <br key={`br-${this.idx}`}></br>

        return token
    }

    parse = (): ReactNode => {
        const acc: ReactNode[] = []
        for(;this.idx < this.data.length;) {
            const token = this.pullToken()
            if (token === undefined) continue;
            const node = this.parseToken(token)
            acc.push(node)
        }
        return acc;
    }
}