import { useQuery } from '@tanstack/react-query';
import PostPreview from '../PostPreview';
import styles from './list.module.scss';
import { getPost } from '~/service';
import { useState } from 'react';
import { Posts } from '~/type';
import { Link } from '@remix-run/react';
import Pagiantion from '../Pagination';

const PostList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPageValue, setInputPageValue] = useState(currentPage.toString());

  const { data } = useQuery({
    queryKey: ['posts', currentPage],
    queryFn: () => getPost({ page: currentPage }),
  });

  return (
    <div>
      <div className={styles.list}>
        {data?.posts.map((item) => (
          <Link to={`/post/${item.id}`} key={item.id}>
            <PostPreview item={item as Posts} />
          </Link>
        ))}
      </div>
      {data && (
        <Pagiantion
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPage={data?.totalPages}
          inputValue={inputPageValue}
          setInputValue={setInputPageValue}
        />
      )}
    </div>
  );
};

export default PostList;
