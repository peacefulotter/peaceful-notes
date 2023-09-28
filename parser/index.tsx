
import { Fragment, ReactNode } from "react";
import { syntaxBuilders, tokenInSyntax } from "./syntax";
import { Line, Editor, Token, Builder } from "./types";
import { CustomBr } from "./components";


export default class Parser {
    idx = 0;
    newLine: boolean = true;
    data: Line;

    constructor(editor: Editor) {
        console.log('==================================================');
        this.data = editor
            .split(/(\n)/g) // split by line-break (\n)
            .map( line => line.split('') ) // turn into tokens
            .flat();
        console.log(this.data);
    }

    pullUntil(until: string, parse?: boolean): ReactNode {
        const acc = []
        let matchUntil = ''
        
        while (matchUntil !== until ) {
            let token = this.pullToken()
            if (token === undefined)
                break;

            matchUntil += token;
            // console.log(`>> parseUntil until=${JSON.stringify(until)}, matchUntil=${JSON.stringify(matchUntil)} startWith: ${until.startsWith(matchUntil)} token: ${JSON.stringify(token)}`);
            
            if ( !until.startsWith(matchUntil) ) {
                const prevToken = matchUntil.at(0) as string
                const node = parse ? this.parseToken(prevToken) : prevToken;
                acc.push(node)
                matchUntil = ''
            }
        }

        // Since we parsed it and we do not want an
        // additional Br component, just set newLine to true here
        if (until === '\n')
            this.newLine = true;
        
        return acc.length === 0 ? '...' : acc;
    }

    pullToken(): Token | undefined {
        return this.idx < this.data.length 
            ? this.data[this.idx++]
            : undefined
    }

    private buildNode(builder: Builder): ReactNode {
        const { endToken, parseInner } = builder
        const props = builder.props?.(this) ||  {}
        const children = this.pullUntil(endToken, parseInner)
        const Node = builder.node;
        console.log(props, builder?.staticProps);
        
        return <Node key={`node-${this.idx}`} {...props} {...builder?.staticProps}>{children}</Node>
    }

    private getFullToken(token: string) {
        let fullToken = '';
        let curToken: string | undefined = token;
        while (tokenInSyntax(fullToken + curToken, this.newLine)) {
            fullToken += curToken;
            curToken = this.pullToken()
            if ( curToken === undefined )
                return { fullToken, push: false }
        }
        console.log(fullToken);
        
        return { fullToken, push: curToken !== ' ' }
    }

    private getBuilder(token: string): Builder<any, any> {
        const { fullToken, push } = this.getFullToken(token)
        if (push)
            this.idx--;
        return syntaxBuilders[fullToken as keyof typeof syntaxBuilders]
    }
    

    private parseToken = (token: string): ReactNode => {

        // console.log(`parseToken == idx=${this.idx}, token: ${JSON.stringify(token)}`);
        if (tokenInSyntax(token, this.newLine)) {
            const builder = this.getBuilder(token)
            this.newLine = false
            console.log('Builder', builder);
            return this.buildNode(builder)
        }
        else if ( token === ' ' )
            return <Fragment key={`fragment-${this.idx}`}>&nbsp;</Fragment>
        else if ( token === '\n' ) {
            this.newLine = true
            return <CustomBr key={`br-${this.idx}`}></CustomBr>
        }
        this.newLine = false
        // TODO: default to a paragraph builder
        // for styling (whitespace wrap) and convenience 
        // in the dom purposes
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