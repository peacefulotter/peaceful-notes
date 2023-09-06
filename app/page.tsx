'use client'

import { ChangeEventHandler, useState } from "react";

import Page from "@/components/Page";
import Renderer from "@/components/Renderer";

const testString = `
# H1
## H2
### H3
this is a normal paragraph
\` code:   foo(bar: Baz)

- list 1.1
- list 1.2
- list 1.3

- \` list with code:   foo(bar: Baz)
- \`\`\`  list with codeblock 
- spanning multiple lines
- need to work on styling
\`\`\`

\`\`\` 
This is a long codeblock that spans on 
multiple lines and might be syntax
highlighted in the future :/
\`\`\`
`

export default function Home() {
	const [editor, setEditor] = useState(testString)
	const onChange: ChangeEventHandler<HTMLTextAreaElement> = ({target}) => setEditor(target.value)

	return (
		<main className="grid grid-cols-2 min-h-screen p-12 bg-sky-100">
			<Page editor={editor} onChange={onChange} />
			<Renderer editor={editor} />
		</main>
	)
}
