import MathJax from "react-mathjax"
// import { Crimson_Pro } from 'next/font/google'

import { BasicProps } from "./types"

//  const crimson = Crimson_Pro({ subsets: ['latin'] })

export const CustomBr = ({}: BasicProps) => 
    <br />

export const CustomNothing = ({children, ...props}: BasicProps) => 
    <>{children}<br/></>

export const CustomParagraph = ({children, ...props}: BasicProps) => 
    <p {...props} className=''>{children}</p>
    
export const CustomH1 = ({children, ...props}: BasicProps) => 
    <h1 {...props} className='break-words font-bold text-4xl border-b-2 border-neutral-500 mb-6'>{children}</h1>

export const CustomH2 = ({children, ...props}: BasicProps) => 
    <h2 {...props} className='break-words font-bold text-3xl mb-4'>{children}</h2>

export const CustomH3 = ({children, ...props}: BasicProps) => 
    <h3 {...props} className='break-words font-bold text-2xl mb-2'>{children}</h3>

export const CustomUl = ({children, ...props}: BasicProps) => 
    <ul {...props} className='break-words border-2 border-red-200 my-2 px-2 list-decimal'>{children}</ul>

export const CustomLi = ({children, ...props}: BasicProps) => 
    <li {...props} className='break-words bg-yellow-200'>{children}</li>

export const CustomCode = ({children, ...props}: BasicProps) => 
    <code {...props} className='break-words bg-gray-200 py-1 px-2 rounded mx-2'>{children}</code>

export const CustomCodeBlock = ({children}: BasicProps) => 
    <div className='font-mono whitespace-pre-wrap bg-gray-200 rounded w-full px-4 py-3'>{children}</div>

    export const CustomMath = ({children, ...props}: BasicProps) => {
    const formula = (children as string[]).join('')
    return <MathJax.Node inline={props.inline} formula={formula} />
} 


export const CustomBold = ({children}: BasicProps) => 
    <strong>{children}</strong>

export const CustomItalic = ({children}: BasicProps) => 
    <i>{children}</i>

// italic, underline, colors