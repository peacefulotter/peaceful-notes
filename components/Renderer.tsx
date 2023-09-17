"use client"

import { ReactNode, useEffect, useState } from "react";
import MathJax from "react-mathjax";

import { Editor } from "@/parser/types";
import Parser from "@/parser";

interface IRenderer {
    editor: Editor;
}

export default function Renderer( { editor }: IRenderer ) {

    const [rendered, setRendered] = useState<ReactNode>()

    useEffect( () => {
        const parser = new Parser(editor)
        const res = parser.parse()
        console.log(res);
        setRendered(res)
    }, [editor] )

    return (
        <MathJax.Provider>
            <div className='bg-slate-100 w-full h-full max-h-full p-8'>
                { rendered }
            </div>
        </MathJax.Provider>
    )
}