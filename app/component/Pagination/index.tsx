import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import styles from './page.module.scss';

const Pagiantion = ({
  currentPage,
  setCurrentPage,
  totalPage,
  inputValue,
  setInputValue,
}: {
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  totalPage: number;
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
}) => {
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
    const value = e.target.value.replace(/[^\d]+/g, '');
    setInputValue(value);
    if (Number(value) < 1) return;
    const verifiedValue = verifyInput(value);
    setCurrentPage(verifiedValue);
  };

  const prev = (currentPage: number) => {
    if (currentPage <= 1) return;
    setCurrentPage(currentPage - 1);
    setInputValue((Number(currentPage) - 1).toString());
  };

  const next = (currentPage: number, totalPage: number) => {
    if (currentPage >= totalPage) return;
    setCurrentPage(currentPage + 1);
    setInputValue((Number(currentPage) + 1).toString());
  };

  const moveToFirst = () => {
    setCurrentPage(1);
    setInputValue('1');
  };

  const moveToLast = () => {
    setCurrentPage(totalPage);
    setInputValue(totalPage.toString());
  };

  return (
    <div className={styles.page}>
      <button onClick={moveToFirst} disabled={currentPage === 1}>
        &lt;&lt;
      </button>
      <button onClick={() => prev(currentPage)} disabled={currentPage === 1 || totalPage < 2}>
        &lt;
      </button>
      <input type="text" value={inputValue} onChange={onPageChange} />
      &#47;
      <input type="text" value={totalPage} readOnly />
      <button onClick={() => next(currentPage, totalPage)} disabled={currentPage === totalPage || totalPage < 2}>
        &gt;
      </button>
      <button onClick={moveToLast} disabled={currentPage === totalPage}>
        &gt;&gt;
      </button>
    </div>
  );
};

export default Pagiantion;
