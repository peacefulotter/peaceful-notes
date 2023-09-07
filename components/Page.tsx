'use client'

import { ChangeEventHandler } from 'react';

interface IPage {
    editor: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export default function Page( { editor, onChange }: IPage ) 
{
    const rows = editor.split(/\r\n|\r|\n/).length    
    return (
        <div className='h-full w-full flex bg-white'>
            <div className='pl-4 pr-2 font-mono tabular-nums text-right text-neutral-500 bg-purple-100 border-r-2 border-purple-200 py-16'>
                { Array.from({length: rows}, (_, i) => {
                    return <div key={`row-${i}`}>{i + 1}</div>;
                }) }
            </div>
            <textarea 
                className='h-full w-full resize-none outline-none pl-4 pr-8 py-16' 
                name='editor' 
                value={editor} 
                onChange={onChange} />
        </div>
       
    )
}