
import { CustomH1, CustomH2, CustomH3 } from '@/parser/components'
import Tokens from '@/parserv2/tokens'
import { ReactNode } from 'react'
import Builder from '.'


const titles = [
    CustomH1, CustomH2, CustomH3
]

export default class TitleBuilder extends Builder {
    depth = 0;
    endToken = '\n'

    token() {
        let token = this.parser.pullToken()
        
        while (token !== undefined && token === Tokens.Title) {
            this.depth++
            token = this.parser.pullToken()
        }
        if ( token !== undefined && token !== ' ' )
            this.parser.idx--
    }
    
    node(savedIdx: number, children?: ReactNode): ReactNode {
        const Title = titles[Math.min(titles.length - 1, this.depth)]
        console.log('depth', Math.min(titles.length - 1, this.depth), 'savedIdx', savedIdx, children);
        
        return <Title key={`title-${savedIdx}`}>{children}</Title>
    }
}