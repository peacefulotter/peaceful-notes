
import { Fragment, ReactNode } from "react";
import { Syntax, Token, backspace, maxTokenLength } from "./syntax";
import { Line, Editor, Frame } from "./types";
import { CustomBr } from "./components";
import getToken from "./token";


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
        
        let frame = this.pullFrame()
        while (frame && !until.test(frame)) {
            // console.log(`>> parseUntil until=${JSON.stringify(until)}, matchUntil=${JSON.stringify(matchUntil)} startWith: ${until.startsWith(matchUntil)} token: ${JSON.stringify(token)}`);
            // Only pull first token cause the rest will be pulled in next iteration 
            if (parse) {
                const node = this.parseFrame(frame);
                acc.push(node)
            }
            else if (frame.at(0) !== undefined) {
                acc.push(frame.at(0))
            }

            frame = this.pullFrame();
        }

        // Since we parsed it and we do not want an
        // additional Br component, just set newLine to true here
        // TODO: test if this works
        if (until === backspace)
            this.newLine = true;
        
        return acc.length === 0 ? '...' : acc;
    }

    // A frame is a string potentially containing one or multiple tokens
    private pullFrame(): Frame | undefined {
        return this.idx < this.data.length 
            ? this.data.slice(this.idx, this.idx + maxTokenLength).join('')
            : undefined
        
    }

    // Returns the node built by the builder
    private buildNodeFromToken(token: Token): ReactNode {
        const builder = Syntax[token].builder
        const { endToken, parseInner } = builder
        const props = builder.props?.(this) ||  {}
        const children = this.pullUntil(endToken, parseInner)
        const Node = builder.node;
        const staticProps = builder.staticProps || {};
        return <Node key={`node-${this.idx}`} {...props} {...staticProps}>{children}</Node>
    }


    private parseFrame = (frame: string): ReactNode => {
        const [token, matched] = getToken(frame, this.newLine)
        console.log(`parseFrame == idx=${this.idx}, frame: ${frame}, token: ${JSON.stringify(token)}, matched: ${matched}`);
        
        if (matched) {
            this.idx += matched.length
            this.newLine = false
            // TODO: use also the token as additional prop to the Node
            return this.buildNodeFromToken(token) 
        }
        else
            this.idx += 1
    
        switch (token) {
            case ' ':
                return <Fragment key={`fragment-${this.idx}`}>&nbsp;</Fragment>
            case '\n':
                this.newLine = true
                return <CustomBr key={`br-${this.idx}`}></CustomBr>
            default:
                this.newLine = false
                // TODO: default to a paragraph builder
                // for styling (whitespace wrap) and convenience 
                // in the dom purposes
                return token
        }
    }

    parse = (): ReactNode => {
        const acc: ReactNode[] = []
        for(;this.idx < this.data.length;) {
            const frame = this.pullFrame()
            if (frame === undefined) continue;
            const node = this.parseFrame(frame)
            acc.push(node)
        }
        return acc;
    }
}