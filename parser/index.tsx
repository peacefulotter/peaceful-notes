
import { Fragment, ReactNode } from "react";
import { Syntax, SyntaxId, backspace, maxLengthPrefix, tokenInSyntax } from "./syntax";
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

    pullUntil(until: RegExp, parse?: boolean): ReactNode {
        const acc = []
        let window = this.pullWindow()
        
        // FIXME: unsure bout this
        while (!until.test(window)) {
            // console.log(`>> parseUntil until=${JSON.stringify(until)}, matchUntil=${JSON.stringify(matchUntil)} startWith: ${until.startsWith(matchUntil)} token: ${JSON.stringify(token)}`);
            const prevToken = window.at(0) as string
            const node = parse ? this.parseToken(prevToken) : prevToken;
            acc.push(node)

            window = this.pullWindow();
        }

        // Since we parsed it and we do not want an
        // additional Br component, just set newLine to true here
        // TODO: test if this works
        if (until === backspace)
            this.newLine = true;
        
        return acc.length === 0 ? '...' : acc;
    }

    // TODO: don't use this anymore for retrieving builders
    // but only used by builders themselves to construct 
    // additional props
    private pullToken(): Token | undefined {
        return this.idx < this.data.length 
            ? this.data[this.idx++]
            : undefined
    }

    private pullWindow(): Token | undefined {
        return this.idx < this.data.length 
            ? this.data.slice(this.idx, this.idx++ + maxLengthPrefix).join()
            : undefined
        
    }

    private buildNode(builder: Builder): ReactNode {
        const { endToken, parseInner } = builder
        const props = builder.props?.(this) ||  {}
        const children = this.pullUntil(endToken, parseInner)
        const Node = builder.node;
        return <Node key={`node-${this.idx}`} {...props} {...builder?.staticProps}>{children}</Node>
    }

    // private getFullToken(acc: Token, best: Token): SyntaxId {
    //     console.log(JSON.stringify(`acc: ${acc}, best: ${best}`));
    //     if (acc.length > maxLengthPrefix)
    //         return best;
    //     const newToken = this.pullToken()
    //     if (newToken === undefined)
    //         return best;

    //     console.log("testing: " + acc + newToken);
    //     console.log("inSyntax: " + tokenInSyntax(acc + newToken, this.newLine));
        
    //     const newBest = tokenInSyntax(acc + newToken, this.newLine)
    //         ? acc + newToken : best
    //     return this.getFullToken(acc + newToken, newBest)
    // }

    private getFullToken(token: string): SyntaxId | undefined {
        


        // let fullToken = '';
        // let curToken: string | undefined = token;
        
        // let i = 0
        // while (i++ < maxLengthPrefix) {
        //     if (!tokenInSyntax(fullToken + curToken, this.newLine))
        //         break

        //     fullToken += curToken;
        //     curToken = this.pullToken()
        //     if ( curToken === undefined )
        //         return fullToken
        // }


        if ( curToken !==  ' ' )
            this.idx--;

        return fullToken
    }

    private parseToken = (token: string): ReactNode => {

        // console.log(`parseToken == idx=${this.idx}, token: ${JSON.stringify(token)}`);
        const fullToken = this.getFullToken(token)
        if (fullToken) {
            const builder = Syntax[fullToken].builder
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
            // TODO: don't pull here, parseToken takes care of it
            const token = this.pullToken()
            if (token === undefined) continue;
            const node = this.parseToken(token)
            acc.push(node)
        }
        return acc;
    }
}