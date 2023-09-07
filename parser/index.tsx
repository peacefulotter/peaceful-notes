
import { 
    CustomBr, CustomCode, CustomCodeBlock, 
    CustomH1, CustomH2, CustomH3, 
    CustomMath, CustomLi, CustomNothing, 
    CustomParagraph, CustomUl 
} from "@/parser/components";
import { Line, Editor, Key } from "@/parser/types";
import { FC, ReactNode } from "react";

export default class Parser {
    private acc: JSX.Element[] = [];
    private idx = 0;

    private lines: Line[];

    private SimpleKeyElementMap: Record<Key, FC<any>> = {
        '#': CustomH1,
        '##': CustomH2,
        '###': CustomH3,
        '`': CustomCode,
    }

    private ComplexKeyElementMap: Record<Key, (line: Line) => void> = {
        '-': (line: Line) => {
            const lines = this.requestLineUntil( ([key, _]) => key !== '-' )
            const vals = [line, ...lines].map( ([_, val]) => val ).filter( val => val !== undefined )
            const list = Parser.fromArray(vals).parse()
            console.log(list);
            const elts = list.map((elt, i) => <CustomLi key={`li-${this.acc.length}-${i}`}>{elt}</CustomLi>)
            this.addElt(CustomUl, elts)
        },
        '```': ([_, val]: Line) => {
            const lines = this.requestLineUntil( ([key, _]) => key === '```' )
            const str = (val ? val + '\n' : '') + lines.map(([k, v]) => k + ' ' + v).join('\n')
            this.addElt(CustomCodeBlock, str)
        },
        '[': ([_, val]: Line) => {

        },
        '@': ([_, v]: Line) => this.addEltWithProps(CustomMath, {v, inline: true}),
        '@@': ([_, v]: Line) => this.addEltWithProps(CustomMath, {v, inline: false}),
    }

    static fromEditor(editor: Editor) {
        return Parser.fromArray(editor.split('\n'))
    }

    static fromArray(arr: string[]) {
        const lines: Line[] = arr.map( line => {
            const [key, val] = line.split(/(?<=^\S+)\s/)
            return [key, val]
        } );
        return new Parser(lines)
    }

    private constructor(lines: Line[]) {
        this.lines = lines;
    }

    private addEltWithProps<T = {}>(Elt: FC<T>, props: T, children?: ReactNode) {
        this.acc.push( <Elt key={`elt-${this.acc.length}`} {...props}>{children}</Elt> )
    }

    private addElt(Elt: FC<{}>, children?: ReactNode) {
        this.addEltWithProps(Elt, {}, children)
    }

    private requestNextLine = (): Line | undefined => {
        if (this.idx >= this.lines.length) 
            return undefined
        const [key, val] = this.lines[this.idx++];
        return [key, val]
    }

    private requestLineUntil = (pred: (l: Line) => boolean): Line[] => {
        const lines: Line[] = [] 
        while (true) {
            const line = this.requestNextLine()
            if ( line === undefined || pred(line) ) 
                return lines;
            lines.push(line)
        }
    }

    private parseLine = (line: Line): void => {
        const [key, v] = line;
        if (!key && !v) 
            this.addElt(CustomBr)
        else if ( key in this.SimpleKeyElementMap )
            this.addElt(this.SimpleKeyElementMap[key], v )
        else if (key in this.ComplexKeyElementMap )
            this.ComplexKeyElementMap[key](line)
        else 
            this.addElt(CustomNothing, key + (v ? ' ' + v : '') )
    }

    parse = (): JSX.Element[] => {
        while (true) {
            const line = this.requestNextLine() 
            if ( line === undefined ) return this.acc
            this.parseLine(line)
        }
    }
}