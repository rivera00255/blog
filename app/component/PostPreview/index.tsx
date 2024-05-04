import { Posts } from '~/type';
import styles from './preview.module.scss';

const PostPreview = ({ item }: { item: Posts }) => {
  return (
    <div className={styles.preview}>
      <p>{item.title}</p>
      <i>{item.createdAt.toLocaleDateString()}</i>
    </div>
  );
};

export default PostPreview;
