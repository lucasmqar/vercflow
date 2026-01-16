import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    List,
    ListOrdered,
    Quote,
    Heading1,
    Heading2,
    Undo,
    Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface RichTextEditorProps {
    content?: string;
    onChange?: (content: string) => void;
    placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Comece a escrever...',
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            if (onChange) {
                onChange(editor.getHTML());
            }
        },
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="flex flex-col w-full border border-border/50 rounded-xl overflow-hidden glass-subtle focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <div className="flex items-center gap-1 p-1 bg-muted/30 border-b border-border/50 overflow-x-auto">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-secondary text-primary' : ''}
                >
                    <Bold size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={editor.isActive('italic') ? 'bg-secondary text-primary' : ''}
                >
                    <Italic size={16} />
                </Button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-secondary text-primary' : ''}
                >
                    <Heading1 size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-secondary text-primary' : ''}
                >
                    <Heading2 size={16} />
                </Button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-secondary text-primary' : ''}
                >
                    <List size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-secondary text-primary' : ''}
                >
                    <ListOrdered size={16} />
                </Button>

                <Separator orientation="vertical" className="h-4 mx-1" />

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <Undo size={16} />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <Redo size={16} />
                </Button>
            </div>

            <EditorContent
                editor={editor}
                className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[150px] outline-none"
            />
        </div>
    );
}
