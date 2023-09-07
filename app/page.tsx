'use client'

import { ChangeEventHandler, useState } from "react";

import Page from "@/components/Page";
import Renderer from "@/components/Renderer";

// const testString = `# H1
// ## H2
// ### H3
// this is a normal paragraph
// \` code:   foo(bar: Baz)

// - list 1.1
// - list 1.2
// - list 1.3

// - \` list with code:   foo(bar: Baz)
// - \`\`\`  list with codeblock 
// - spanning multiple lines
// - need to work on styling
// \`\`\`

// \`\`\` 
// This is a long codeblock that spans on 
// multiple lines and might be syntax
// highlighted in the future :/
// \`\`\`
// `

const testString = `# H1`

export default function Home() {
	const [editor, setEditor] = useState(testString)
	const onChange: ChangeEventHandler<HTMLTextAreaElement> = ({target}) => setEditor(target.value)

	return (
		<main className='relative min-h-screen h-full max-h-screen p-12 bg-neutral-200'>
			<div className='absolute flex gap-2 bg-gradient-to-br from-purple-200 to-sky-200 rounded-tl-xl rounded-br-xl w-fit py-2 px-8'>
                <div className='font-bold'>⌂ &gt; path &gt; to &gt; file &gt;</div>
                <div className='font-thin'>notes.md</div>
            </div>
			<div className='grid grid-cols-2 h-full overflow-scroll rounded-xl'>
				<Page editor={editor} onChange={onChange} />
				<Renderer editor={editor} />
			</div>
		</main>
	)
}
