import { Suspense, lazy, useCallback, useRef, useState } from 'react';
import { ClientOnly } from 'remix-utils/client-only';
import 'suneditor/dist/css/suneditor.min.css';
import SunEditorCore from 'suneditor/src/lib/core';
import styles from './editor.module.scss';
import { UploadInfo } from 'suneditor-react/dist/types/upload';
import { UploadBeforeHandler } from 'suneditor-react/dist/types/upload';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addPost, deleteImage, deletePost, getPostById, saveImage, updatePost } from '~/service';
import { useNavigate } from '@remix-run/react';
import { useNotifyStore } from '~/store/notify';

const SunEditor = lazy(() => import('suneditor-react'));

const Editor = ({ user, id }: { user: { uid: string; email: string; nickname: string }; id?: string }) => {
  // const [value, setValue] = useState('');
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const editor = useRef<SunEditorCore>();
  const date = new Date();
  const postId = String(id);
  // const [images, setImages] = useState<string[]>([]);
  // console.log(images);

  const navigate = useNavigate();

  const { show } = useNotifyStore();

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => getPostById(postId),
    enabled: !!id,
  });
  // console.log(data);

  const { mutate: create } = useMutation({
    mutationFn: addPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    },
  });

  const { mutate: update } = useMutation({
    mutationFn: updatePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      navigate(`/post/${id}`);
    },
  });

  const { mutate: delPost } = useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      navigate('/');
    },
  });

  const handleResizeHeight = useCallback(() => {
    if (titleRef.current) {
      titleRef.current.style.height = '0px';
      titleRef.current.style.height = titleRef.current.scrollHeight + 'px';
    }
  }, []);

  const getSunEditorInstance = (sunEditor: SunEditorCore) => {
    editor.current = sunEditor;
  };

  const deletePostImage = (userId: string) => {
    if (editor.current) {
      const images = editor.current.getImagesInfo();
      images.forEach((item) => deleteImage({ image: item, userId }));
    }
  };

  const onSubmit = (mode: 'create' | 'update') => {
    if (titleRef.current && editor.current) {
      const title = titleRef.current.value;
      const text = editor.current.getText().trim();
      const content = editor.current.getContents(true);
      if (title.length > 0 && (text.length > 0 || editor.current.getImagesInfo().length > 0)) {
        mode === 'create' && create({ title, content, createdAt: date, user });
        mode === 'update' && update({ userId: user.uid, post: { title, content, id: String(id) } });
      } else {
        show({ message: '제목과 내용을 입력하세요.' });
      }
    }
  };

  // const handleEditorChange = (content: string) => {
  //   setValue(content);
  // };

  const onImageUploadBefore = (files: Array<File>, info: object, uploadHandler: UploadBeforeHandler) => {
    (async () => {
      const time = new Date().getTime();
      const filename = `${files[0].name}${time}`;
      const url = await saveImage({ image: { file: files[0], name: filename }, userId: user.uid });
      if (url) {
        const response = { url: url, name: filename, size: files[0].size };
        uploadHandler({
          result: [response],
        });
      }
    })();

    return undefined;
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

  const imageUploadHandler = (
    xmlHttpRequest: XMLHttpRequest,
    info: {
      isUpdate: boolean;
      linkValue: any;
      element: Element;
      align: any;
      linkNewWindow: any;
      [key: string]: any;
    }
  ) => {};

  return (
    <div className={styles.editorWrapper}>
      <textarea ref={titleRef} defaultValue={data?.title || ''} onInput={handleResizeHeight} maxLength={140} />
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
                setContents={data?.content ?? ''}
                width="100%"
                height="320px"
              />
              {!data ? (
                <div className={styles.buttonWrapper}>
                  <button onClick={() => onSubmit('create')}>
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
              ) : (
                user.uid === data.user.uid && (
                  <div className={styles.buttonWrapper}>
                    <button onClick={() => onSubmit('update')}>
                      <span>
                        <svg
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M5 20H19"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p>edit</p>
                      </span>
                    </button>
                    <button
                      style={{ marginLeft: '10px' }}
                      onClick={() => {
                        if (confirm('are you sure you want to delete it?')) {
                          if (data && typeof data.id === 'string') {
                            deletePostImage(user.uid);
                            delPost({ id: data.id, userId: user.uid });
                          }
                        }
                      }}>
                      <span>
                        <svg
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M10 12V17"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M14 12V17"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M4 7H20"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                            stroke="#9ca3af"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <p>delete</p>
                      </span>
                    </button>
                  </div>
                )
              )}
            </div>
          </Suspense>
        )}
      </ClientOnly>
    </div>
  );
};

export default Editor;
