import React, { useCallback, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, Slate, withReact } from 'slate-react';

// Since we are likely in a React Native environment (Expo), using standard Slate (DOM-based) might be tricky without a bridge.
// However, the user asked for Slate and usage on "Web" was discussed.
// If this is for Web (React Native Web), it should work fine.
// If for native, we might need a webview or alternative.
// Assuming "Web" support for now based on previous context, but will try to make it renderable.

// Note: Slate-React components (Editable) return DOM nodes (div, span).
// React Native Web maps some of these, but Slate relies heavily on DOM selection APIs.
// This component should ideally only be rendered on Web.

interface RichTextEditorProps {
    value: Descendant[];
    onChange: (value: Descendant[]) => void;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({ value, onChange }) => {
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);

    // Define a rendering function for elements
    const renderElement = useCallback((props: any) => {
        switch (props.element.type) {
            case 'code':
                return <CodeElement {...props} />;
            default:
                return <DefaultElement {...props} />;
        }
    }, []);

    return (
        <View style={styles.container}>
            <Slate editor={editor} initialValue={value} onChange={onChange}>
                <Editable
                    renderElement={renderElement}
                    placeholder="Enter some rich text..."
                    style={styles.editable}
                />
            </Slate>
        </View>
    );
};

const CodeElement = (props: any) => {
    return (
        <pre {...props.attributes}>
            <code>{props.children}</code>
        </pre>
    );
};

const DefaultElement = (props: any) => {
    return <p {...props.attributes}>{props.children}</p>;
};

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 8,
        minHeight: 150,
        backgroundColor: 'white',
    },
    editable: {
        outline: 'none', // Web-specific
        minHeight: 130,
    } as any, // "outline" is not valid RN style but valid on Web
});
