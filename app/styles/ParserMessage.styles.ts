import { StyleSheet } from 'react-native';
import { Platform } from 'react-native';

// Style pour la classe 'ParserMessage' : les styles sont nécessaires au bon fonctionnement de la librairie 'react-native-markdown-display'
export const styles = StyleSheet.create({
    body: {
    },
    // Headings
    heading1: {
      flexDirection: 'row',
      fontSize: 32,
      fontWeight: 'bold',
    },
    heading2: {
      flexDirection: 'row',
      fontSize: 24,
      fontWeight: 'bold',
    },
    heading3: {
      flexDirection: 'row',
      fontSize: 18,
      fontWeight: 'bold',
    },
    heading4: {
      flexDirection: 'row',
      fontSize: 16,
    },
    heading5: {
      flexDirection: 'row',
      fontSize: 13,
    },
    heading6: {
      flexDirection: 'row',
      fontSize: 11,
    },
  
    // Horizontal Rule
    hr: {
      backgroundColor: '#ffffff',
      height: 1,
    },
  
    // Emphasis
    strong: {
      fontWeight: 'bold',
    },
    em: {
      fontStyle: 'italic',
    },
    s: {
      textDecorationLine: 'line-through',
    },
  
    // Blockquotes
    blockquote: {
      backgroundColor: '#f0f0f0',
      borderColor: '#CCC',
      borderLeftWidth: 4,
      marginLeft: 5,
      paddingHorizontal: 5,
    },
  
    // Lists
    bullet_list: {},
    ordered_list: {
    },
    list_item: {
      color: '#ffffff',
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_icon: {
      marginLeft: 10,
      marginRight: 10,
      fontWeight: 'bold',
    },
    // @pseudo class, does not have a unique render rule
    bullet_list_content: {
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_icon: {
      marginLeft: 10,
      marginRight: 10,
      fontWeight: 'bold',
      fontSize: 16,
    },
    // @pseudo class, does not have a unique render rule
    ordered_list_content: {
    },
  
    // Code
    code_inline: {
      borderWidth: 1,
      borderColor: '#CCCCCC',
      backgroundColor: '#2e2d2d',
      padding: 10,
      borderRadius: 5,
      ...Platform.select({
        ['ios']: {
          fontFamily: 'Courier',
          color: '#d92e2e',
          fontWeight: 'bold',
        },
        ['android']: {
          fontFamily: 'monospace',
          color: '#d92e2e',
          fontWeight: 'bold',
        },
      }),
    },
    code_block: {
      borderWidth: 1,
      borderColor: '#CCCCCC',
      backgroundColor: '#2e2d2d',
      padding: 10,
      borderRadius: 4,
      ...Platform.select({
        ['ios']: {
          fontFamily: 'Courier',
          color: '#ffffff',
        },
        ['android']: {
          fontFamily: 'monospace',
          color: '#ffffff',
        },
      }),
    },
    fence: {
      borderWidth: 1,
      borderColor: '#CCCCCC',
      backgroundColor: '#524f4f',
      padding: 10,
      borderRadius: 4,
      ...Platform.select({
        ['ios']: {
          fontFamily: 'Courier',
          color: '#ffffff',
        },
        ['android']: {
          fontFamily: 'monospace',
          color: '#ffffff',
        },
      }),
      flexDirection: 'row',
      flexWrap: 'nowrap',
    },
  
    // Tables
    table: {
      borderWidth: 1,
      borderColor: '#000000',
      borderRadius: 3,
    },
    thead: {},
    tbody: {},
    th: {
      flex: 1,
      padding: 5,
    },
    tr: {
      borderBottomWidth: 1,
      borderColor: '#000000',
      flexDirection: 'row',
    },
    td: {
      flex: 1,
      padding: 5,
    },
  
    // Links
    link: {
      textDecorationLine: 'underline',
    },
    blocklink: {
      flex: 1,
      borderColor: '#000000',
      borderBottomWidth: 1,
    },
  
    // Images
    image: {
      flex: 1,
    },
  
    // Text Output
    text: {
      color: 'white',
      fontSize: 16,  
    },
    textgroup: {},
    paragraph: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      width: '100%',
    },
    hardbreak: {
      width: '100%',
      height: 1,
    },
    softbreak: {},
  
    // ScrollView
    fence_horizontal_scrollviews: {
  
    },
    fence_horizontal_scrollview_content: {
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
  
    // Believe these are never used but retained for completeness
    pre: {},
    inline: {},
    span: {},
  });
export default styles;