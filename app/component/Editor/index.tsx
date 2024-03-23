import { Suspense, lazy, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import styles from './editor.module.scss';

const SunEditor = lazy(() => import('suneditor-react'));

const Editor = () => {
  const [value, setValue] = useState('');
  const editor = useRef<SunEditorCore>();

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const handleEditorChange = (content: string) => {
    setValue(content);
  };

  return (
    <ClientOnly fallback={null}>
      {() => (
        <Suspense fallback={<div>Loading...</div>}>
          <div className={styles.editor}>
            <SunEditor
              getSunEditorInstance={getSunEditorInstance}
              onChange={handleEditorChange}
              width="100%"
              height="320px"
            />
            <div className={styles.buttonWrapper}>
              <button onClick={() => console.log(value)}>write</button>
            </div>
          </div>
        </Suspense>
      )}
    </ClientOnly>
  );
};

export default Editor;
