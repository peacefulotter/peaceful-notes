"use client"

import { FC, PropsWithChildren, ReactNode, useEffect, useState } from "react";
import MathJax from "react-mathjax";

type Editor = string;
type Key = string;
type Line = [Key, string]

type CompositeProps<T> = PropsWithChildren<T>
type BasicProps = CompositeProps<{}>
type StringProps = CompositeProps<{v: string}>

const Br = ({}: BasicProps) => <br />
const Nothing = ({children, ...props}: BasicProps) => <>{children}<br/></>
const Paragraph = ({children, ...props}: BasicProps) => <p {...props} className=''>{children}</p>
const H1 = ({children, ...props}: BasicProps) => <h1 {...props} className='break-words font-bold text-4xl border-b-2 border-neutral-500 mb-6'>{children}</h1>
const H2 = ({children, ...props}: BasicProps) => <h2 {...props} className='break-words font-bold text-3xl mb-4'>{children}</h2>
const H3 = ({children, ...props}: BasicProps) => <h3 {...props} className='break-words font-bold text-2xl mb-2'>{children}</h3>
const Ul = ({children, ...props}: BasicProps) => <ul {...props} style={{listStyle: 'inside'}} className='break-words border-2 border-red-200 my-2 px-2'>{children}</ul>
const Li = ({children, ...props}: BasicProps) => <li {...props} className='break-words bg-yellow-200'>{children}</li>
const Code = ({children, ...props}: BasicProps) => <code {...props} className='break-words bg-gray-200 p-1 rounded'>{children}</code>
const InlineMath = ({v}: StringProps) => <MathJax.Node inline formula={v} />
// italic, underline, colors
const CodeBlock = ({children}: BasicProps) => <div className='font-mono whitespace-pre-wrap bg-gray-400 rounded w-full px-4 py-2'>{children}</div>
// const MathBlock


class Parser {
    private acc: JSX.Element[] = [];
    private idx = 0;

    private lines: Line[];

    private SimpleKeyElementMap: Record<Key, FC<any>> = {
        '#': H1,
        '##': H2,
        '###': H3,
        '`': Code,
        '@': InlineMath
    }

    private ComplexKeyElementMap: Record<Key, (line: Line) => void> = {
        '-': (line: Line) => {
            const lines = this.requestLineUntil( ([key, _]) => key !== '-' )
            const vals = [line, ...lines].map( ([_, val]) => val ).filter( val => val !== undefined )
            const list = Parser.fromArray(vals).parse()
            console.log(list);
            const elts = list.map(elt => <Li>{elt}</Li>)
            this.addElt(Ul, elts)
        },
        '```': ([_, val]: Line) => {
            const lines = this.requestLineUntil( ([key, _]) => key === '```' )
            const str = (val ? val + '\n' : '') + lines.map(([k, v]) => k + ' ' + v).join('\n')
            this.addElt(CodeBlock, str)
        },
        '@@': () => {
            // Math
            this.addElt(Paragraph, '/// MATH ///' )
        }
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

    private addElt(Elt: FC<any>, children?: ReactNode) {
        this.acc.push( <Elt key={`elt-${this.acc.length}`}>{children}</Elt> )
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
        console.log(key, v);
        if (!key && !v) 
            this.addElt(Br)
        else if ( key in this.SimpleKeyElementMap )
            this.addElt(this.SimpleKeyElementMap[key], v )
        else if (key in this.ComplexKeyElementMap )
            this.ComplexKeyElementMap[key](line)
        else 
            this.addElt(Nothing, key + (v ? ' ' + v : '') )
    }

    parse = (): JSX.Element[] => {
        while (true) {
            const line = this.requestNextLine() 
            if ( line === undefined ) return this.acc
            this.parseLine(line)
        }
    }
}

interface IRenderer {
    editor: Editor;
}

export default function Renderer( { editor }: IRenderer ) {

    const [rendered, setRendered] = useState<ReactNode>()

    useEffect( () => {
        const parser = Parser.fromEditor(editor)
        setRendered(parser.parse())
    }, [editor] )

    return (
        <MathJax.Provider>
            <div className='bg-slate-100 w-full h-full max-h-full p-8'>
                { rendered }
            </div>
        </MathJax.Provider>
    )
}