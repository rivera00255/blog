import styles from './post.module.scss';
import { useQuery } from '@tanstack/react-query';
import { getComment, getPostById } from '~/service';
import { useOutletContext, useParams } from '@remix-run/react';
import PostDetail from '~/component/PostDetail';
import { Comments, Posts } from '~/type';
import CommentForm from '~/component/CommentForm';
import Comment from '~/component/Comment';
import { User } from 'firebase/auth';
import { Fragment, useEffect, useMemo, useState } from 'react';
import PagiantionButton from '~/component/PaginationButton';

const Post = () => {
  const params = useParams();
  const id = String(params.id);

  const [commentPage, setCommentPage] = useState(1);
  const [currentPageBlock, setCurrentPageBlock] = useState(0);
  const pageLimit = 5;

  const user = useOutletContext<User | null>();

  const { data } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
  });
  // console.log(data);
  const { data: comments } = useQuery({
    queryKey: ['comment', id, commentPage],
    queryFn: () => getComment({ postId: id, page: commentPage }),
  });
  // console.log(comments);

  // const comment = useMemo(() => comments?.comments.filter((item) => !item.parent), [comments]);
  // const reply = useMemo(() => comments?.comments.filter((item) => item.parent), [comments]);
  // console.log(comment);
  // console.log(reply);

  useEffect(() => {
    if (comments && comments.totalPages > 1) {
      setCommentPage(comments.totalPages);
      setCurrentPageBlock(Math.ceil(comments.totalPages / pageLimit) - 1);
    }
  }, []);

  return (
    <div className={styles.container}>
      {data && <PostDetail item={data as Posts} />}
      <div className={styles.comment}>
        {/* {comments?.comments.map((item) => (
          <Fragment key={item.id}>
            <Comment comment={item as Comments} writer={data?.user.uid ?? ''} />
            {item.reply &&
              item.reply.map((rep) => (
                <Comment comment={rep as Comments} writer={data?.user.uid ?? ''} parent={item.id} key={rep.id} />
              ))}
          </Fragment>
        ))} */}
        {/* {comment?.map((item) => (
          <Fragment key={item.id}>
            <Comment comment={item as Comments} writer={data?.user.uid ?? ''} />
            {reply?.map(
              (rep) =>
                rep.parent === item.id && (
                  <Comment comment={rep as Comments} writer={data?.user.uid ?? ''} parent={item.id} key={rep.id} />
                )
            )}
          </Fragment>
        ))} */}
        {comments?.comments.map((item) => (
          <Comment comment={item as Comments} writer={data?.user.uid ?? ''} key={item.id} parent={item.parent} />
        ))}
        {comments && comments.totalElements > 0 && (
          <PagiantionButton
            currentPage={commentPage}
            setCurrentPage={setCommentPage}
            currentPageBlock={currentPageBlock}
            setCurrentPageBlock={setCurrentPageBlock}
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
