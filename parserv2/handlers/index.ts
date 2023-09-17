import { ReactNode } from "react";
import { Token } from "../types";
import ParserV2 from "..";


export default abstract class Builder {
    parser: ParserV2;
    constructor(parser: ParserV2) { this.parser = parser; }
    abstract endToken: Token;
    abstract node(savedIdx: number, children?: ReactNode): ReactNode
    token() {};
    props() {};
}