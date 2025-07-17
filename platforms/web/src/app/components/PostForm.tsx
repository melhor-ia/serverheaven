"use client";

import { useState } from 'react';
import NextImage from 'next/image';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';
import { Send, Bold, Italic, Underline } from 'lucide-react';
import { EditorProvider, useCurrentEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import UnderlineExtension from '@tiptap/extension-underline';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { cn } from '@/lib/utils';
import { ChainedCommands } from '@tiptap/core';
import { MentionList } from './MentionList';
import { ReactRenderer } from '@tiptap/react';
import tippy, { Instance as TippyInstance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { SuggestionOptions, SuggestionProps } from '@tiptap/suggestion';
import { AnimatePresence, motion } from 'framer-motion';

interface UserSearchResult {
    id: string;
    displayName: string;
    photoURL: string;
}

const createSuggestionOptions = (char: string): Omit<SuggestionOptions, 'editor'> => ({
    items: async ({ query }) => {
        if (char === '@') {
            if (query.length === 0) return [];
            const functions = getFunctions();
            const searchUsers = httpsCallable(functions, 'api');
            const response = await searchUsers({ route: `users/search?q=${query}`, method: 'GET' });
            return (response.data as UserSearchResult[]) || [];
        }

        if (char === '$') {
            const servers = [
                { id: '1', name: 'Cool Server' },
                { id: '2', name: 'Gaming Hub' },
                { id: '3', name: 'Dev Community' },
            ];
            return servers.filter(s => s.name.toLowerCase().startsWith(query.toLowerCase()));
        }

        return [];
    },

  render: () => {
    let component: ReactRenderer<unknown>;
    let popup: TippyInstance[];

    return {
      onStart: (props: SuggestionProps) => {
        component = new ReactRenderer(MentionList, {
          props,
          editor: props.editor,
        });

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as () => DOMRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        });
      },

      onUpdate: (props: SuggestionProps) => {
        component.updateProps(props);

        if (!props.clientRect) {
            return;
        }
        popup[0].setProps({
          getReferenceClientRect: props.clientRect as () => DOMRect,
        });
      },

      onKeyDown: (props: { event: KeyboardEvent }) => {
        if (props.event.key === 'Escape') {
          popup[0].hide();
          return true;
        }
        
        const mentionListRef = component.ref as { onKeyDown: (props: { event: KeyboardEvent }) => boolean; };
        return mentionListRef?.onKeyDown(props);
      },

      onExit() {
        popup[0].destroy();
        component.destroy();
      },
    };
  },
  char,
  command: ({ editor, range, props }) => {
    const nodeType = editor.schema.nodes.mention;
    const { id, type } = props;

    editor
      .chain()
      .focus()
      .insertContentAt(range, [
        {
          type: nodeType.name,
          attrs: { id: id, label: id, type },
        },
        {
          type: 'text',
          text: ' ',
        },
      ])
      .run()
  }
});


const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  const toggleStyle = (style: 'bold' | 'italic' | 'underline') => {
      const command: ChainedCommands = editor.chain().focus();
      if (style === 'bold') command.toggleBold().run();
      if (style === 'italic') command.toggleItalic().run();
      if (style === 'underline') command.toggleUnderline().run();
  }

  const getButtonClass = (style: 'bold' | 'italic' | 'underline') => cn(
      "p-2 rounded-md hover:bg-black/20 hover:text-white transition-colors",
      editor.isActive(style) ? "bg-black/20 text-white" : "text-muted-foreground"
  );

  return (
    <div className="p-1 flex items-center gap-1 border-b border-border">
      <button type="button" onClick={() => toggleStyle('bold')} className={getButtonClass('bold')}>
        <Bold className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => toggleStyle('italic')} className={getButtonClass('italic')}>
        <Italic className="h-4 w-4" />
      </button>
      <button type="button" onClick={() => toggleStyle('underline')} className={getButtonClass('underline')}>
        <Underline className="h-4 w-4" />
      </button>
    </div>
  )
}


interface PostFormProps {
    onPostCreated: () => void;
    userServers?: { id: string, name: string }[];
    className?: string;
}

const PostForm = ({ onPostCreated, className }: PostFormProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { currentUser } = useAuth();
    const [content, setContent] = useState('');
    const [editorContent, setEditorContent] = useState('');
    const { editor } = useCurrentEditor();

    const MAX_CHARACTERS = 2000;
    
    const extensions = [
        StarterKit.configure({
            heading: false,
            strike: false,
            code: false,
            codeBlock: false,
            blockquote: false,
            horizontalRule: false,
            listItem: false,
            orderedList: false,
            bulletList: false,
            bold: {
                HTMLAttributes: {
                    class: 'font-bold',
                },
            },
            italic: {
                HTMLAttributes: {
                    class: 'italic',
                },
            }
        }),
        UnderlineExtension,
        Placeholder.configure({
            placeholder: () => {
                // Return a different placeholder based on whether the editor is expanded
                if (!isExpanded) {
                    return "The world wants to know. What's up?";
                }
                // When expanded, show more detailed instructions
                return "\n• Use @ to mention users\n• Use $ to mention servers\n• Press Ctrl+Enter to post";
            },
        }),
        Mention.configure({
            HTMLAttributes: {
                class: 'mention',
            },
            renderLabel({ options, node }) {
                return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
            },
            suggestion: createSuggestionOptions('@'),
        }),
        Mention.configure({
            HTMLAttributes: {
                class: 'mention',
            },
            renderLabel({ options, node }) {
                return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`
            },
            suggestion: createSuggestionOptions('$'),
        }),
    ];

    const clearForm = () => {
        setContent('');
        setEditorContent('');
        if (editor) {
            editor.commands.clearContent();
        }
        setError(null);
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) {
            e.preventDefault();
        }
        
        if (!editorContent.trim() || !currentUser) {
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const mentionedUsers: string[] = [];
        const mentionedServers: string[] = [];

        if (editor) {
            editor.state.doc.descendants((node) => {
                if (node.type.name === 'mention') {
                    if (node.attrs.id.startsWith('@')) {
                        mentionedUsers.push(node.attrs.id.substring(1));
                    } else if (node.attrs.id.startsWith('$')) {
                        mentionedServers.push(node.attrs.id.substring(1));
                    }
                }
            });
        }

        try {
            const functions = getFunctions();
            const createPostCallable = httpsCallable(functions, 'api'); 

            await createPostCallable({
                route: 'posts',
                method: 'POST',
                data: { 
                    content: content,
                    type: 'update',
                    tags: {
                        users: mentionedUsers,
                        servers: mentionedServers
                    }
                }
            });

            clearForm();
            setIsExpanded(false);
            onPostCreated();
        } catch (err) {
            console.error("Error creating post:", err);
            setError("Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
        if (event.ctrlKey && event.key === 'Enter' && !isSubmitting && editorContent.trim()) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleFocus = () => {
        if (!isExpanded) {
            setIsExpanded(true);
        }
    };

    const handleBlur = () => {
        // Collapse if content is empty
        if (!editorContent.trim()) {
            setIsExpanded(false);
        }
    };

    if (!currentUser) {
        return null; // Don't show the form if not logged in
    }

    return (
        <div className={cn("hud-panel rounded-lg overflow-hidden p-4 sm:p-6 mb-8 transition-all duration-300", { "py-3 sm:py-3": !isExpanded }, className)}>
            <form onSubmit={handleSubmit}>
                <div className="flex items-start space-x-4">
                    <NextImage 
                        src={currentUser.photoURL || '/default-avatar.png'} 
                        alt="Your avatar" 
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full object-cover" 
                    />
                    <div className="flex-1" onFocus={handleFocus} onBlur={handleBlur}>
                         <EditorProvider 
                            key={isExpanded ? 'expanded' : 'collapsed'}
                            extensions={extensions} 
                            content={content}
                            onUpdate={({ editor }) => {
                                setContent(editor.getHTML());
                                setEditorContent(editor.getText());
                            }}
                            editorProps={{
                                attributes: {
                                    class: 'prose prose-sm prose-invert p-3 min-h-[40px] w-full max-w-none focus:outline-none',
                                },
                                handleKeyDown: (view, event) => {
                                    handleKeyDown(event);
                                    return false; // Allow other handlers to run
                                },
                            }}
                            slotBefore={isExpanded ? <MenuBar /> : undefined}
                            immediatelyRender={false}
                        >
                            {/* The editor content is rendered here */}
                        </EditorProvider>
                        <AnimatePresence>
                        {isExpanded && (
                             <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="text-right text-xs font-mono mt-1.5 text-muted-foreground">
                                    {editorContent.length} / {MAX_CHARACTERS}
                                </div>
                                
                                <div className="flex justify-end items-center mt-4">
                                    <div className="flex items-center gap-2">
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting || !editorContent.trim()}
                                        >
                                            {isSubmitting ? 'Posting...' : 'Post'}
                                            <Send className="ml-2 h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                        </AnimatePresence>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostForm; 