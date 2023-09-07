"use client"

import { ReactNode, useEffect, useState } from "react";
import MathJax from "react-mathjax";

import { Editor } from "@/parser/types";
import ParserV2 from "@/parserv2";

interface IRenderer {
    editor: Editor;
}

export default function Renderer( { editor }: IRenderer ) {

    const [rendered, setRendered] = useState<ReactNode>()

    useEffect( () => {
        // const parser = Parser.fromEditor(editor)
        const parser = new ParserV2(editor)
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