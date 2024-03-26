import { Dispatch, SetStateAction } from 'react';
import styles from './page.module.scss';

const Pagiantion = ({
  pageBlockLimit,
  currentPage,
  setCurrentPage,
  currentPageBlock,
  setCurrentPageBlock,
  totalPage,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  currentPageBlock: number;
  setCurrentPageBlock: Dispatch<SetStateAction<number>>;
  pageBlockLimit: number;
  totalPage: number;
}) => {
  const pageOffset = currentPageBlock * pageBlockLimit;

  const createPageArray = (totalPage: number) => {
    return Array(totalPage)
      .fill(undefined)
      .map((_, i) => i + 1);
  };

  let pageable = createPageArray(totalPage).slice(pageOffset, pageOffset + pageBlockLimit);

  const prev = () => {
    if (currentPageBlock < 1 || currentPageBlock === 0) return;
    setCurrentPageBlock((prev) => prev - 1);
    setCurrentPage((currentPageBlock - 1) * pageBlockLimit + 1);
  };

  const next = () => {
    if ((currentPageBlock + 1) * pageBlockLimit >= totalPage) return;
    setCurrentPageBlock((prev) => prev + 1);
    setCurrentPage((currentPageBlock + 1) * pageBlockLimit + 1);
    console.log(currentPageBlock);
  };

  const moveToFirst = () => {
    setCurrentPage(1);
    setCurrentPageBlock(0);
  };

  const moveToLast = () => {
    setCurrentPage(totalPage);
    setCurrentPageBlock(Math.ceil(totalPage / pageBlockLimit) - 1);
  };

  return (
    <div className={styles.page}>
      <button onClick={moveToFirst} disabled={currentPage === 1 || currentPageBlock === 0}>
        &lt;&lt;
      </button>
      <button onClick={() => prev()} disabled={currentPage === 1 || totalPage === 1 || currentPageBlock === 0}>
        &lt;
      </button>
      {pageable.length > 0 &&
        pageable.map((i) => (
          <button data-index={currentPage === i ? i : null} key={i} onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        ))}
      <button
        onClick={() => next()}
        disabled={currentPage === totalPage || totalPage <= 1 || (currentPageBlock + 1) * pageBlockLimit >= totalPage}>
        &gt;
      </button>
      <button
        onClick={moveToLast}
        disabled={
          currentPage === totalPage ||
          Math.ceil(totalPage / pageBlockLimit) <= 1 ||
          (currentPageBlock + 1) * pageBlockLimit >= totalPage
        }>
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagiantion;
