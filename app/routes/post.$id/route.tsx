import styles from './post.module.scss';
import { useQuery } from '@tanstack/react-query';
import { getComment, getPostById } from '~/service';
import { useOutletContext, useParams } from '@remix-run/react';
import PostDetail from '~/component/PostDetail';
import { Comments, Posts } from '~/type';
import CommentForm from '~/component/CommentForm';
import Comment from '~/component/Comment';
import { User } from 'firebase/auth';
import { useState } from 'react';
import PagiantionButton from '~/component/PaginationButton';

const Post = () => {
  const params = useParams();
  const id = String(params.id);

  const [commentPage, setCommentPage] = useState(1);
  const pageLimit = 5;

  const user = useOutletContext<User | null>();

  const { data } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
  });
  // console.log(data);
  const { data: comments } = useQuery({
    queryKey: ['comment', id],
    queryFn: () => getComment({ postId: id }),
  });
  // console.log(comments);

  return (
    <div className={styles.container}>
      {data && <PostDetail item={data as Posts} />}
      <div className={styles.comment}>
        {comments?.comments.map((item) => <Comment comment={item as Comments} key={item.id} />)}
        {comments && comments.totalElements > 0 && (
          <PagiantionButton
            currentPage={commentPage}
            setCurrentPage={setCommentPage}
            pageLimit={pageLimit}
            totalPage={comments?.totalPages}
          />
        )}
      </div>
      {user && <CommentForm postId={id} />}
    </div>
  );
};

export default Post;
