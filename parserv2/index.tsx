
import { Line, Editor, Token } from "@/parserv2/types";
import { ReactNode } from "react";
import Builder, { Syntax, syntaxBuilders, tokenInSyntax } from "./syntax";
import { match } from "assert";


export default class ParserV2 {
    idx = 0;
    data: Line;

    // private ComplexElementMap: Record<Token, (i: number) => ReactNode> = {
    //     '[': ([_, val]: Line) => {

    //     },

    constructor(editor: Editor) {
        console.log('==================================================');
        this.data = editor
            .split(/(\n)/g) // split by line-break (\n)
            .map( line => line.split('') ) // turn into tokens
            .flat();
        console.log(this.data);
    }

    private pullUntil(until: string, parse?: boolean): ReactNode {
        const acc = []
        let matchUntil = ''
        let token = this.pullToken();
        while (token !== undefined && token !== until) {
            if ( until.startsWith(matchUntil + token) ) {
                matchUntil += token;
                if ( matchUntil === until )
                    break;
            } else
                matchUntil = ''
            console.log(JSON.stringify(`>> parseUntil until=${until}, matchUntil=${matchUntil} idx=${this.idx}, token: ${JSON.stringify(token)}`));

            const node = parse ? this.parseToken(token) : token;
            acc.push(node)
            token = this.pullToken()
        }
        return acc.length === 0 ? '...' : acc;
    }

    pullToken(): Token | undefined {
        return this.idx < this.data.length 
            ? this.data[this.idx++]
            : undefined
    }

    private buildNode(builder: Builder): ReactNode {
        const { endToken, parseInner, staticProps } = builder
        const props = { ...staticProps, ...builder.props?.() }
        const children = this.pullUntil(endToken, parseInner)
        const Node = builder.node;
        return <Node key={`node-${this.idx}`} {...props}>{children}</Node>
    }

    private getBuilder(token: string): Builder {
        let fullToken = token;
        while (tokenInSyntax(fullToken)) {
            const curToken = this.pullToken()
            if ( curToken === undefined ) break
            fullToken += curToken
            
        }
        if (fullToken.length > 1) {
            this.idx--;
            fullToken = fullToken.slice(0, -1)
        }
        return syntaxBuilders[fullToken as keyof typeof syntaxBuilders]
    }
    

    private parseToken = (token: string): ReactNode => {

        console.log(`parseToken == idx=${this.idx}, token: ${JSON.stringify(token)}`);

        if (tokenInSyntax(token)) {
            console.log('========= Creating ');
            const builder = this.getBuilder(token)
            console.log('Builder', builder);
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