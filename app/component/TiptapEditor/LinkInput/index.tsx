import { Editor } from '@tiptap/react';
import { Dispatch, SetStateAction, useState } from 'react';
import styles from './link.module.scss';

const LinkInput = ({
  editor,
  linkToggle,
}: {
  editor: Editor | null;
  linkToggle: Dispatch<SetStateAction<boolean>>;
}) => {
  const [inputValue, setInputValue] = useState('https://');

  const addLink = () => {
    if (!editor) return;
    // const previousUrl = editor.getAttributes('link').href;
    const url = inputValue;

    if (url.replace('https://', '').length < 1) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      setInputValue('https://');
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    setInputValue('https://');
  };

  return (
    <div className={styles.link} onClick={(e) => e.stopPropagation()}>
      <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <div>
        <button onClick={() => linkToggle(false)}>취소</button>
        <button onClick={() => addLink()}>확인</button>
      </div>
    </div>
  );
};

export default LinkInput;
