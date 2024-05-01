import { Dispatch, SetStateAction, useState } from 'react';
import styles from './page.module.scss';

const PagiantionButton = ({
  currentPage,
  setCurrentPage,
  totalPage,
  pageLimit,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  pageLimit: number;
}) => {
  const [currentPageBlock, setCurrentPageBlock] = useState(0);

  const pageOffset = currentPageBlock * pageLimit;

  const createPageBlock = (totalPage: number) => {
    return Array.from({ length: totalPage }, (_, i) => i + 1);
  };

  const prev = () => {
    if (currentPageBlock < 1 || currentPageBlock === 0) return;
    setCurrentPage((currentPageBlock - 1) * pageLimit + 1);
    setCurrentPageBlock((prev) => prev - 1);
  };

  const next = () => {
    if ((currentPageBlock + 1) * pageLimit >= totalPage) return;
    setCurrentPage((currentPageBlock + 1) * pageLimit + 1);
    setCurrentPageBlock((prev) => prev + 1);
  };

  const moveToFirst = () => {
    setCurrentPage(1);
    setCurrentPageBlock(0);
  };

  const moveToLast = () => {
    setCurrentPage(totalPage);
    setCurrentPageBlock(Math.ceil(totalPage / pageLimit) - 1);
  };

  return (
    <div className={styles.page}>
      <button onClick={moveToFirst} disabled={currentPage === 1 || currentPageBlock === 0}>
        &lt;&lt;
      </button>
      <button onClick={() => prev()} disabled={currentPage === 1 || totalPage < 2 || currentPageBlock === 0}>
        &lt;
      </button>
      {createPageBlock(totalPage)
        .slice(pageOffset, pageOffset + pageLimit)
        .map((i) => (
          <button key={i} data-index={currentPage === i ? i : null} onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        ))}
      <button
        onClick={() => next()}
        disabled={currentPage === totalPage || totalPage < 2 || (currentPageBlock + 1) * pageLimit >= totalPage}>
        &gt;
      </button>
      <button
        onClick={moveToLast}
        disabled={
          currentPage === totalPage ||
          Math.ceil(totalPage / pageLimit) <= 1 ||
          (currentPageBlock + 1) * pageLimit >= totalPage
        }>
        &gt;&gt;
      </button>
    </div>
  );
};

export default PagiantionButton;
