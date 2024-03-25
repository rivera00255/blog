import { useQuery } from '@tanstack/react-query';
import PostPreview from '../PostPreview';
import styles from './list.module.scss';
import { getPost } from '~/service';

const PostList = () => {
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPost(),
  });
  console.log(data);

  return (
    <div className={styles.list}>
      <PostPreview />
    </div>
  );
};

export default PostList;
