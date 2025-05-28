import React from "react";
import Markdown from 'react-native-markdown-display';
import {styles} from "@/app/styles/ParserMessage.styles";



/**
 * Parse Les messages des conversations
 */
export default class ParserMessage extends React.Component<{content: string}, {}> {

    render() {
        return (
            <Markdown style={styles} >{this.props.content}</Markdown>
        );
    }
}