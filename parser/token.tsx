
import { Syntax, Token } from "./syntax";
import { Frame, TokenSyntax } from "./types";

/**
 * Returns true if the frame matches the syntax, in which case the frame contains a token.
 * 
 * The return statement, saying that a frame IS a token, is not entirely correct
 * since a frame can contain multiple tokens, but it is a token in the sense that
 * it is a string that is part of the syntax
*/ 
const frameMatchesSyntax = (
    frame: string,
    newLine: boolean,
    syntax: TokenSyntax
): frame is Token => {
    const { regex, newLine: newLineSyntax } = syntax;
    return (
        (newLineSyntax ? newLine === newLineSyntax : true) &&
        regex.frame.test(frame)
    )
};


// Returns the longest token that matches the frame
const getLongestTokenMatchingFrame = (frame: Frame, newLine: boolean): [Token, string] | undefined => {
    let best: [Token, string] | undefined = undefined
    for (const [token, syntax] of Object.entries(Syntax)) {
        const { regex } = syntax
        if (frameMatchesSyntax(frame, newLine, syntax) && (best === undefined || token.length > best.length))
            best = [token as Token, frame.match(regex.token)![0]]
    }   
    return best
}


// Returns the token that matches the frame, or the first character of the frame if no token matches
// Additionally returns the matched string
export default function getTokenMatchingFrame(frame: Frame, newLine: boolean): [Token, string] | [string, undefined]  {
    const matchedFrame = getLongestTokenMatchingFrame(frame, newLine)
    console.log('matched frame: ', frame, matchedFrame);
    if (matchedFrame !== undefined) {
        const [token, matched] = matchedFrame 
        return [token, matched]
    }
    return [frame.at(0) as string, undefined]
}