'use client'

import { ChangeEventHandler, useState } from 'react';

interface IPage {
    editor: string;
    onChange: ChangeEventHandler<HTMLTextAreaElement>
}

export default function Page( { editor, onChange }: IPage ) 
{
    return (
        <div className='h-full w-full rounded bg-white overflow-hidden'>
            <div className='flex gap-2 bg-sky-200 rounded w-fit py-2 px-8'>
                <div className='font-bold'>⌂ &gt; path &gt; to &gt; file</div>
                <div className='font-thin'>notes.md</div>
            </div>
            <textarea 
                className='h-full w-full resize-none outline-none p-8' 
                name='editor' 
                value={editor} 
                onChange={onChange} />
        </div>
    )
}