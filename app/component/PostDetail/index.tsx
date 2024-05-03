import { Posts } from '~/type';
import DOMPurify from 'dompurify';
import styles from './detail.module.scss';
import { Link, useOutletContext } from 'react-router-dom';
import { User } from '@firebase/auth';

const PostDetail = ({ item }: { item: Posts }) => {
  const user = useOutletContext<User | null>();

  return (
    <div className={styles.container}>
      <div className={styles.post}>
        <div className={styles.title}>{item.title}</div>
        <hr />
        <div className={styles.intro}>
          <span>{item.user.nickname}</span>
          <span>
            {item.createdAt.toLocaleString('ko-KR', {
              year: 'numeric',
              month: 'numeric',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: false,
            })}
          </span>
        </div>
        <div className={styles.content}>
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.content) }} />
        </div>
      </div>
      {user && (
        <div className={styles.buttonWrapper}>
          <Link to={`/modify/${item.id}`}>
            <button>
              <svg width="18px" height="18px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132"
                  stroke="#9ca3af"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M5 20H19" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PostDetail;
