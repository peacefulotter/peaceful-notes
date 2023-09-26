import MathJax from "react-mathjax"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Highlight, themes } from 'prism-react-renderer'

import { ComponentProps } from "./types"

export const CustomBr = ({}: ComponentProps) => <div className="h-2"></div>

export const CustomNothing = ({ children }: ComponentProps) => 
    <>{children}<br/></>

export const CustomParagraph = ({ children }: ComponentProps) => 
    <p className=''>{children}</p>
    
export const CustomH1 = ({ children }: ComponentProps) => 
    <h1 className='break-words font-bold text-4xl border-b-2 border-neutral-500 mb-6'>{children}</h1>

export const CustomH2 = ({ children }: ComponentProps) => 
    <h2 className='break-words font-bold text-3xl mb-4'>{children}</h2>

export const CustomH3 = ({ children }: ComponentProps) => 
    <h3 className='break-words font-bold text-2xl mb-2'>{children}</h3>

export const CustomUl = ({ children }: ComponentProps) => 
    <ul className='break-words border-2 border-red-200 my-2 px-2 list-decimal'>{children}</ul>

export const CustomLi = ({ children }: ComponentProps) => 
    <li className='break-words'>{children}</li>

export const CustomCode = ({ children }: ComponentProps) => {
    const code = Array.isArray(children) 
        ? children.join('')
        : ''

    return (
        <Highlight
            theme={themes.oneLight}
            code={code}
            language="ts"
        >   
        {({ tokens, getTokenProps }) => (
            <p className="inline font-mono max-w-min whitespace-nowrap px-2 py-1 bg-neutral-200 rounded">
                {tokens[0].map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                ))}
            </p>
        )}
        </Highlight>
    )
}
    

export const CustomCodeblock = ({ children }: ComponentProps) => 
    <SyntaxHighlighter language="javascript" style={oneDark}>
        {(children as string[]).join('')}
    </SyntaxHighlighter>

export const CustomMath = ({ children, inline }: ComponentProps<{inline: boolean}>) => {
    const formula = Array.isArray(children) 
        ? (children as string[]).join('')
        : ''
    return <MathJax.Node inline={inline} formula={formula} />
} 


export const CustomBold = ({ children }: ComponentProps) => 
    <strong>{children}</strong>

export const CustomItalic = ({ children }: ComponentProps) => 
    <i>{children}</i>

export const CustomBoldItalic = ({ children }: ComponentProps) => 
    <CustomBold><CustomItalic>{children}</CustomItalic></CustomBold>