import { User } from 'firebase/auth';
import { Posts } from '~/type';
import styles from './like.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { disLikePost, likePost } from '~/service';

const LikeButton = ({ item, user }: { item: Posts; user: User | null }) => {
  const queryClient = useQueryClient();

  const { mutate: like } = useMutation({
    mutationFn: likePost,
    onMutate: () => {
      const previous = queryClient.getQueryData(['post', item.id]);
      queryClient.setQueryData(['post', item.id], (prev: Posts) => ({
        ...prev,
        ...(user &&
          !prev.like.userId.includes(user.uid) && {
            like: { userId: [...prev.like.userId, user?.uid], count: prev.like.count + 1 },
          }),
      }));
      return previous;
    },
    onError: () => {
      queryClient.setQueryData(['post', item.id], queryClient.getQueryData(['post', item.id]));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['post', item.id] }),
  });

  const { mutate: dislike } = useMutation({
    mutationFn: disLikePost,
    onMutate: () => {
      const previous = queryClient.getQueryData(['post', item.id]);
      queryClient.setQueryData(['post', item.id], (prev: Posts) => ({
        ...prev,
        ...(user &&
          prev.like.userId.includes(user.uid) && {
            like: { userId: [...prev.like.userId.filter((id) => id !== user?.uid)], count: prev.like.count - 1 },
          }),
      }));
      return previous;
    },
    onError: () => {
      queryClient.setQueryData(['post', item.id], queryClient.getQueryData(['post', item.id]));
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['post', item.id] }),
  });

  const toggleLike = (postId: string, userId: string) => {
    if (!item.like.userId.includes(userId)) {
      like({ postId, userId });
    } else {
      dislike({ postId, userId });
    }
  };

  return (
    <button
      disabled={!user}
      className={styles.button}
      onClick={() => {
        if (user) toggleLike(String(item.id), user.uid);
      }}>
      {user ? (
        item.like.userId.includes(user?.uid) ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_1"
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="#f43f5e">
            <path d="M17.5.917a6.4,6.4,0,0,0-5.5,3.3A6.4,6.4,0,0,0,6.5.917,6.8,6.8,0,0,0,0,7.967c0,6.775,10.956,14.6,11.422,14.932l.578.409.578-.409C13.044,22.569,24,14.742,24,7.967A6.8,6.8,0,0,0,17.5.917Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="#f43f5e">
            <g id="_01_align_center" data-name="01 align center">
              <path d="M17.5.917a6.4,6.4,0,0,0-5.5,3.3A6.4,6.4,0,0,0,6.5.917,6.8,6.8,0,0,0,0,7.967c0,6.775,10.956,14.6,11.422,14.932l.578.409.578-.409C13.044,22.569,24,14.742,24,7.967A6.8,6.8,0,0,0,17.5.917ZM12,20.846c-3.253-2.43-10-8.4-10-12.879a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,7.967h2a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,7.967C22,12.448,15.253,18.416,12,20.846Z" />
            </g>
          </svg>
        )
      ) : item.like.count > 0 ? (
        <svg xmlns="http://www.w3.org/2000/svg" id="Layer_1" viewBox="0 0 24 24" width="14" height="14" fill="#f43f5e">
          <path d="M17.5.917a6.4,6.4,0,0,0-5.5,3.3A6.4,6.4,0,0,0,6.5.917,6.8,6.8,0,0,0,0,7.967c0,6.775,10.956,14.6,11.422,14.932l.578.409.578-.409C13.044,22.569,24,14.742,24,7.967A6.8,6.8,0,0,0,17.5.917Z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14" fill="#f43f5e">
          <g id="_01_align_center" data-name="01 align center">
            <path d="M17.5.917a6.4,6.4,0,0,0-5.5,3.3A6.4,6.4,0,0,0,6.5.917,6.8,6.8,0,0,0,0,7.967c0,6.775,10.956,14.6,11.422,14.932l.578.409.578-.409C13.044,22.569,24,14.742,24,7.967A6.8,6.8,0,0,0,17.5.917ZM12,20.846c-3.253-2.43-10-8.4-10-12.879a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,11,7.967h2a4.8,4.8,0,0,1,4.5-5.05A4.8,4.8,0,0,1,22,7.967C22,12.448,15.253,18.416,12,20.846Z" />
          </g>
        </svg>
      )}
      <span>{item.like.count.toLocaleString()}</span>
    </button>
  );
};

export default LikeButton;
