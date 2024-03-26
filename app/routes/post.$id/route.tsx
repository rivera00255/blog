import styles from './post.module.scss';
import { useQuery } from '@tanstack/react-query';
import { getPostById } from '~/service';
import { useParams } from '@remix-run/react';
import PostDetail from '~/component/PostDetail';
import { Posts } from '~/type';

const Post = () => {
  const params = useParams();
  const id = String(params.id);

  const { data } = useQuery({
    queryKey: ['post', id],
    queryFn: () => getPostById(id),
  });
  // console.log(data);

  return <div className={styles.container}>{data && <PostDetail item={data as Posts} />}</div>;
};

export default Post;
