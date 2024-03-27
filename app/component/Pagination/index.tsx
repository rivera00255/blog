import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from './page.module.scss';

const Pagiantion = ({
  currentPage,
  setCurrentPage,
  // currentPageBlock,
  // setCurrentPageBlock,
  pageBlockLimit,
  totalPage,
  inputValue,
  setInputValue,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  // currentPageBlock: number;
  // setCurrentPageBlock: Dispatch<SetStateAction<number>>;
  pageBlockLimit: number;
  totalPage: number;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}) => {
  // const pageOffset = currentPageBlock * pageBlockLimit;

  const createPageArray = (totalPage: number) => {
    return Array(totalPage)
      .fill(undefined)
      .map((_, i) => i + 1);
  };

  // let pageable = createPageArray(totalPage).slice(pageOffset, pageOffset + pageBlockLimit);

  const verifyInput = (value: string) => {
    const isNumRegex = /^[0-9]*$/;
    if (isNumRegex.test(value)) {
      if (Number(value) > totalPage) return currentPage;
      if (Number(value) < 1) return currentPage;
      return Number(value);
    }
    return currentPage;
  };

  const onPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const verifiedValue = verifyInput(value);
    setCurrentPage(verifiedValue);
  };

  const prev = () => {
    if (currentPage <= 1) return;
    setCurrentPage((page) => page - 1);
    setInputValue((prev) => (Number(prev) - 1).toString());
    // if (currentPageBlock < 1 || currentPageBlock === 0) return;
    // setCurrentPageBlock((prev) => prev - 1);
    // setCurrentPage((currentPageBlock - 1) * pageBlockLimit + 1);
  };

  const next = () => {
    if (currentPage >= totalPage) return;
    setCurrentPage((page) => page + 1);
    setInputValue((prev) => (Number(prev) + 1).toString());
    // if ((currentPageBlock + 1) * pageBlockLimit >= totalPage) return;
    // setCurrentPageBlock((prev) => prev + 1);
    // setCurrentPage((currentPageBlock + 1) * pageBlockLimit + 1);
  };

  const moveToFirst = () => {
    setCurrentPage(1);
    setInputValue('1');
    // setCurrentPageBlock(0);
  };

  const moveToLast = () => {
    setCurrentPage(totalPage);
    setInputValue(totalPage.toString());
    // setCurrentPageBlock(Math.ceil(totalPage / pageBlockLimit) - 1);
  };

  return (
    <div className={styles.page}>
      <button onClick={moveToFirst} disabled={currentPage === 1}>
        &lt;&lt;
      </button>
      <button onClick={() => prev()} disabled={currentPage === 1 || totalPage < 2}>
        &lt;
      </button>
      <input type="text" value={inputValue} onChange={onPageChange} />
      &#47;
      <input type="text" value={totalPage} readOnly />
      {/* {pageable.length > 0 &&
        pageable.map((i) => (
          <button data-index={currentPage === i ? i : null} key={i} onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        ))} */}
      <button onClick={() => next()} disabled={currentPage === totalPage || totalPage < 2}>
        &gt;
      </button>
      <button onClick={moveToLast} disabled={currentPage === totalPage}>
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagiantion;
