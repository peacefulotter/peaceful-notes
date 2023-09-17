
import { Line, Editor, Token } from "@/parserv2/types";
import { Fragment, ReactNode } from "react";
import Builder, { syntaxBuilders, tokenInSyntax } from "./syntax";


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

    private pullUntil(until: string, parse?: boolean, keepBackspace?: boolean): ReactNode {
        const acc = []
        let matchUntil = ''
        let token = this.pullToken();
        
        while (token !== undefined && matchUntil !== until ) {
            matchUntil += token;
            console.log(`>> parseUntil until=${JSON.stringify(until)}, matchUntil=${JSON.stringify(matchUntil)} startWith: ${until.startsWith(matchUntil)} token: ${JSON.stringify(token)}`);
            
            if ( !until.startsWith(matchUntil) ) {
                for (let prevTokens of matchUntil) {
                    const node = parse ? this.parseToken(prevTokens) : prevTokens;
                    acc.push(node)
                }
                matchUntil = ''
            }

            token = this.pullToken()
        }
        
        if (keepBackspace && until === '\n' && token !== undefined)
            this.idx--;

        return acc.length === 0 ? '...' : acc;
    }

    pullToken(): Token | undefined {
        return this.idx < this.data.length 
            ? this.data[this.idx++]
            : undefined
    }

    private buildNode(builder: Builder): ReactNode {
        const { endToken, parseInner, staticProps, keepBackspace } = builder
        const props = { ...staticProps, ...builder.props?.() }
        const children = this.pullUntil(endToken, parseInner, keepBackspace)
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
            const builder = this.getBuilder(token)
            console.log('Builder', builder);
            return this.buildNode(builder)
        }
        else if ( token === ' ' )
            return <Fragment key={`fragment-${this.idx}`}>&nbsp;</Fragment>
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