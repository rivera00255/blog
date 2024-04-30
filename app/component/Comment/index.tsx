import { useEffect, useRef, useState } from 'react';
import styles from './comment.module.scss';
import { Comments } from '~/type';
import { useOutletContext } from '@remix-run/react';
import { User } from 'firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment, updateComment } from '~/service';

const Comment = ({ comment }: { comment: Comments }) => {
  const user = useOutletContext<User | null>();

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(48);

  const [isEdit, setIsEdit] = useState(false);

  const queryClient = useQueryClient();

  const { mutate: update } = useMutation({
    mutationFn: updateComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', comment.postId] });
      setIsEdit(false);
    },
  });

  const { mutate: delComment } = useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      setIsEdit(false);
      queryClient.invalidateQueries({ queryKey: ['comment', comment.postId] });
    },
  });

  useEffect(() => {
    if (cloneRef.current) {
      const elemHeight = Math.max(48, cloneRef.current.offsetHeight);
      setHeight(elemHeight);
    }
  }, []);

  return (
    <div className={styles.container}>
      {/* <p>{comment.user.email}</p> */}
      <div ref={cloneRef} className={styles.clone}>
        {comment.text}
      </div>
      <textarea defaultValue={comment.text} ref={commentRef} style={{ height: `${height}px` }} readOnly={!isEdit} />
      {user && user.uid === comment.user.uid && (
        <div className={styles.buttons}>
          {isEdit ? (
            <>
              <button
                onClick={() => {
                  if (commentRef.current && commentRef.current.value.trim().length > 0) {
                    const text = commentRef.current.value.trim();
                    update({ id: String(comment.id), userId: user.uid, text });
                  }
                }}>
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M4 12.6111L8.92308 17.5L20 6.5"
                    stroke="#9ca3af"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  if (confirm('wanna delete it?')) delComment({ id: String(comment.id), userId: user.uid });
                }}>
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M17.2929 5.29289C17.6834 4.90237 18.3166 4.90237 18.7071 5.29289C19.0976 5.68342 19.0976 6.31658 18.7071 6.70711L13.4142 12L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L12 13.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L10.5858 12L5.29289 6.70711C4.90237 6.31658 4.90237 5.68342 5.29289 5.29289C5.68342 4.90237 6.31658 4.90237 6.70711 5.29289L12 10.5858L17.2929 5.29289Z"
                    fill="#9ca3af"
                  />
                </svg>
              </button>
            </>
          ) : (
            <button onClick={() => setIsEdit(true)}>
              <svg
                width="14px"
                height="14px"
                viewBox="0 -0.5 21 21"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink">
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Dribbble-Light-Preview" transform="translate(-379.000000, -800.000000)" fill="#9ca3af">
                    <g id="icons" transform="translate(56.000000, 160.000000)">
                      <path
                        d="M327.2,654 L325.1,654 L325.1,646 L327.2,646 L327.2,644 L323,644 L323,656 L327.2,656 L327.2,654 Z M333.5,644 L333.5,646 L341.9,646 L341.9,654 L333.5,654 L333.5,656 L344,656 L344,644 L333.5,644 Z M331.4,658 L333.5,658 L333.5,660 L327.2,660 L327.2,658 L329.3,658 L329.3,642 L327.2,642 L327.2,640 L333.5,640 L333.5,642 L331.4,642 L331.4,658 Z"
                        id="edit_text_bar-[#1372]"></path>
                    </g>
                  </g>
                </g>
              </svg>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Comment;
