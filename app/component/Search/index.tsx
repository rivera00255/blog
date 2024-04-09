import { Dispatch, SetStateAction, useState } from 'react';
import styles from './search.module.scss';

const Search = ({
  searchString,
  setSearchString,
}: {
  searchString: undefined | string[];
  setSearchString: Dispatch<SetStateAction<undefined | string[]>>;
}) => {
  // const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  const onSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      if (inputValue.trim().length > 0) {
        const keyword = inputValue.split(' ');
        setSearchString(keyword);
      }
      // if (inputRef.current) {
      //   const inputValue = inputRef.current.value.trim();
      //   const keyword = inputValue.split(' ');
      //   setSearchString(keyword);
      // }
    }
  };

  return (
    <div className={styles.search}>
      <label>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Outline"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="#6b7280">
            <path d="M23.707,22.293l-5.969-5.969a10.016,10.016,0,1,0-1.414,1.414l5.969,5.969a1,1,0,0,0,1.414-1.414ZM10,18a8,8,0,1,1,8-8A8.009,8.009,0,0,1,10,18Z" />
          </svg>
        </span>
        <input
          type="text"
          placeholder="search"
          // ref={inputRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyUp={onSubmit}
        />
        {searchString && (
          <button
            onClick={() => {
              setSearchString(undefined);
              setInputValue('');
            }}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              id="xmark"
              data-name="xmark"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="#6b7280">
              <path d="m15.707,9.707l-2.293,2.293,2.293,2.293c.391.391.391,1.023,0,1.414-.195.195-.451.293-.707.293s-.512-.098-.707-.293l-2.293-2.293-2.293,2.293c-.195.195-.451.293-.707.293s-.512-.098-.707-.293c-.391-.391-.391-1.023,0-1.414l2.293-2.293-2.293-2.293c-.391-.391-.391-1.023,0-1.414s1.023-.391,1.414,0l2.293,2.293,2.293-2.293c.391-.391,1.023-.391,1.414,0s.391,1.023,0,1.414Zm8.293,2.293c0,6.617-5.383,12-12,12S0,18.617,0,12,5.383,0,12,0s12,5.383,12,12Zm-2,0c0-5.514-4.486-10-10-10S2,6.486,2,12s4.486,10,10,10,10-4.486,10-10Z" />
            </svg>
          </button>
        )}
      </label>
    </div>
  );
};

export default Search;
