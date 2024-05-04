import { useEffect, useRef, useState } from 'react';
import styles from './comment.module.scss';
import { Comments } from '~/type';
import { useOutletContext } from '@remix-run/react';
import { User } from 'firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteComment, updateComment } from '~/service';
import CommentForm from '../CommentForm';

const Comment = ({ comment, writer, parent }: { comment: Comments; writer: string; parent?: string }) => {
  const user = useOutletContext<User | null>();

  const commentRef = useRef<HTMLTextAreaElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(48);

  const [isEdit, setIsEdit] = useState(false);
  const [isReply, setIsReply] = useState(false);

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
      const elemHeight = Math.max(48, Number(cloneRef.current.offsetHeight) + 10);
      setHeight(elemHeight);
    }
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        {parent && (
          <span style={{ marginRight: '10px' }}>
            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Arrow / Arrow_Sub_Down_Right">
                <path
                  id="Vector"
                  d="M13 11L18 16M18 16L13 21M18 16H10.1969C9.07899 16 8.5192 16 8.0918 15.7822C7.71547 15.5905 7.40973 15.2839 7.21799 14.9076C7 14.4798 7 13.9201 7 12.8V3"
                  stroke="#737373"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </span>
        )}
        <span className={writer === comment.user.uid ? `${styles.light}` : ''}>{comment.user.username}</span>
        <span>
          {comment.createdAt.toLocaleString('ko-KR', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
          })}
        </span>
        {user && !parent && (
          <button onClick={() => setIsReply(!isReply)}>
            <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g id="Arrow / Arrow_Sub_Right_Down">
                <path
                  id="Vector"
                  d="M11 13L16 18M16 18L21 13M16 18V10.1969C16 9.07899 16 8.5192 15.7822 8.0918C15.5905 7.71547 15.2839 7.40973 14.9076 7.21799C14.4798 7 13.9201 7 12.8 7H3"
                  stroke="#737373"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            </svg>
          </button>
        )}
      </div>
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
              <svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M11 21H12C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3H11M11 16L15 12M15 12L11 8M15 12H3"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      )}
      {isReply && <CommentForm postId={comment.postId} parent={comment.id} setIsReply={setIsReply} />}
    </div>
  );
};

export default Comment;
