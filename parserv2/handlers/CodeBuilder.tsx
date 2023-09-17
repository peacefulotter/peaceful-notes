import { ReactNode } from 'react'

import Builder from '.'
import Tokens from '@/parserv2/tokens'
import { CustomCode } from '@/parser/components';

export default class CodeBuilder extends Builder {
    endToken = Tokens.Code

    node(savedIdx: number, children?: ReactNode): ReactNode {
        return <CustomCode key={`code-${savedIdx}`}>{children}</CustomCode>
    }
}