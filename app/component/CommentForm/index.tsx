import { SyntheticEvent, useRef, useState } from 'react';
import styles from './comment.module.scss';
import { useOutletContext } from '@remix-run/react';
import { User } from 'firebase/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addComment } from '~/service';

const CommentForm = ({ postId }: { postId: string }) => {
  const user = useOutletContext<User | null>();
  const userInfo = { uid: String(user?.uid), email: String(user?.email) };

  const [comment, setComment] = useState('');
  const commentRef = useRef<HTMLTextAreaElement>(null);

  const date = new Date();

  const queryClient = useQueryClient();

  const { mutate: write } = useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment', postId] });
      setComment('');
    },
  });

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (comment.trim().length > 0) {
      const text = comment.trim();
      write({ text, user: userInfo, createdAt: date, postId });
    }
  };

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      <button>
        <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6.29289 8.70711C6.68342 9.09763 7.31658 9.09763 7.70711 8.70711L11 5.41421L11 16C11 16.5523 11.4477 17 12 17C12.5523 17 13 16.5523 13 16L13 5.41421L16.2929 8.70711C16.6834 9.09763 17.3166 9.09763 17.7071 8.70711C18.0976 8.31658 18.0976 7.68342 17.7071 7.29289L12.7071 2.29289C12.3166 1.90237 11.6834 1.90237 11.2929 2.29289L6.29289 7.29289C5.90237 7.68342 5.90237 8.31658 6.29289 8.70711Z"
            fill="#9ca3af"
          />
          <path
            d="M4 22C3.44772 22 3 21.5523 3 21C3 20.4477 3.44772 20 4 20H20C20.5523 20 21 20.4477 21 21C21 21.5523 20.5523 22 20 22H4Z"
            fill="#9ca3af"
          />
        </svg>
      </button>
    </form>
  );
};

export default CommentForm;
