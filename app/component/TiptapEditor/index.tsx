import { Editor, EditorContent } from '@tiptap/react';
import MenuBar from './MenuBar';
import './editor.scss';
import { ClientOnly } from 'remix-utils/client-only';

const TiptapEditor = ({
  editor,
  user,
}: {
  editor: Editor | null;
  user: { uid: string; email: string; username: string };
}) => {
  return (
    <ClientOnly fallback={null}>
      {() => (
        <>
          <MenuBar editor={editor} user={user} />
          <div className="content" onClick={() => editor && editor.commands.focus()}>
            <EditorContent editor={editor} />
          </div>
        </>
      )}
    </ClientOnly>
  );
};

export default TiptapEditor;
