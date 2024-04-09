import { useQuery } from '@tanstack/react-query';
import PostPreview from '../PostPreview';
import styles from './list.module.scss';
import { getPost } from '~/service';
import { useEffect, useState } from 'react';
import { Posts } from '~/type';
import { Link } from '@remix-run/react';
import Pagiantion from '../Pagination';
import Search from '../Search';
import { usePageMarkerState } from '~/store/pageMarker';

const PostList = () => {
  const { page } = usePageMarkerState();
  const [currentPage, setCurrentPage] = useState(1);
  const [inputPageValue, setInputPageValue] = useState(currentPage.toString());
  const [searchString, setSearchString] = useState<undefined | string[]>(undefined);

  const { data } = useQuery({
    queryKey: ['posts', currentPage, searchString],
    queryFn: () => getPost({ page: currentPage, keyword: searchString }),
  });

  useEffect(() => {
    if (page > 1) {
      setCurrentPage(page);
      setInputPageValue(page.toString());
    }
  }, [page]);

  useEffect(() => {
    if (searchString) {
      setCurrentPage(1);
      setInputPageValue('1');
    }
  }, [searchString]);

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
      <Search searchString={searchString} setSearchString={setSearchString} />
    </div>
  );
};

export default PostList;
