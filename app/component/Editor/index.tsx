import { Suspense, lazy, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import styles from './editor.module.scss';
import { UploadInfo } from 'suneditor-react/dist/types/upload';
import { UploadBeforeHandler } from 'suneditor-react/dist/types/upload';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addPost } from '~/service';

const SunEditor = lazy(() => import('suneditor-react'));

const Editor = ({ user }: { user: { uid: string; email: string } }) => {
  // const [value, setValue] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);
  const editor = useRef<SunEditorCore>();
  const date = new Date();

  const queryClient = useQueryClient();

  const { mutate: create } = useMutation({ mutationFn: addPost });

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const onSubmit = () => {
    // console.log(editor.current?.getContents(true));
    if (titleRef.current && editor.current) {
      const title = titleRef.current.value;
      const text = editor.current.getText().trim();
      const content = editor.current.getContents(true);
      if (title.length > 0 && text.length > 0) {
        create({ title, content, createdAt: date, user });
      } else {
        alert('제목과 내용을 입력하세요.');
      }
    }
  };

  // const handleEditorChange = (content: string) => {
  //   setValue(content);
  // };

  const onImageUploadBefore = (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => {
    console.log(files);
    return true;
  };

  const handleImageUpload = (
    targetImgElement: HTMLImageElement,
    index: number,
    state: 'create' | 'update' | 'delete',
    imageInfo: UploadInfo<HTMLImageElement>,
    remainingFilesCount: number
  ) => {
    console.log(targetImgElement);
  };

  return (
    <div className={styles.editorWrapper}>
      <input type="text" ref={titleRef} />
      <ClientOnly fallback={null}>
        {() => (
          <Suspense fallback={<div>Loading...</div>}>
            <div className={styles.editor}>
              <SunEditor
                setOptions={{
                  buttonList: [
                    ['undo', 'redo', 'font', 'fontSize', 'formatBlock'],
                    ['link', 'image', 'fullScreen', 'showBlocks', 'codeView', 'preview', 'print'],
                    ['fontColor', 'hiliteColor', 'outdent', 'indent', 'align', 'horizontalRule', 'list', 'table'],
                    ['bold', 'underline', 'italic', 'strike', 'subscript', 'superscript', 'removeFormat'],
                  ],
                }}
                getSunEditorInstance={getSunEditorInstance}
                // onChange={handleEditorChange}
                onImageUploadBefore={onImageUploadBefore}
                // onImageUpload={handleImageUpload}
                width="100%"
                height="320px"
              />
              <div className={styles.buttonWrapper}>
                <button onClick={onSubmit}>
                  <span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      id="Outline"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      fill="#6b7280">
                      <path d="M18.656.93,6.464,13.122A4.966,4.966,0,0,0,5,16.657V18a1,1,0,0,0,1,1H7.343a4.966,4.966,0,0,0,3.535-1.464L23.07,5.344a3.125,3.125,0,0,0,0-4.414A3.194,3.194,0,0,0,18.656.93Zm3,3L9.464,16.122A3.02,3.02,0,0,1,7.343,17H7v-.343a3.02,3.02,0,0,1,.878-2.121L20.07,2.344a1.148,1.148,0,0,1,1.586,0A1.123,1.123,0,0,1,21.656,3.93Z" />
                      <path d="M23,8.979a1,1,0,0,0-1,1V15H18a3,3,0,0,0-3,3v4H5a3,3,0,0,1-3-3V5A3,3,0,0,1,5,2h9.042a1,1,0,0,0,0-2H5A5.006,5.006,0,0,0,0,5V19a5.006,5.006,0,0,0,5,5H16.343a4.968,4.968,0,0,0,3.536-1.464l2.656-2.658A4.968,4.968,0,0,0,24,16.343V9.979A1,1,0,0,0,23,8.979ZM18.465,21.122a2.975,2.975,0,0,1-1.465.8V18a1,1,0,0,1,1-1h3.925a3.016,3.016,0,0,1-.8,1.464Z" />
                    </svg>
                    <p>write</p>
                  </span>
                </button>
              </div>
            </div>
          </Suspense>
        )}
      </ClientOnly>
    </div>
  );
};

export default Editor;
