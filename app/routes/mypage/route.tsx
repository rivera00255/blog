import { ChangeEvent, SyntheticEvent, useState } from 'react';
import styles from './mypage.module.scss';
import { Navigate, useLocation, useNavigate, useOutletContext } from '@remix-run/react';
import { EmailAuthProvider, User, deleteUser, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { useNotifyStore } from '~/store/notify';
import { validatePassword } from '~/utilities';
import { deleteAllCommentByUser, deleteAllPostByUser } from '~/service';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import PostList from '~/component/PostList';

const reauthenticate = async (user: User, password: string) => {
  const credential = EmailAuthProvider.credential(String(user.email), password);
  try {
    await reauthenticateWithCredential(user, credential);
    return true;
  } catch (error) {
    return false;
  }
};

const MyPage = () => {
  const [mode, setMode] = useState<'default' | 'update' | 'delete'>('default');
  const [inputValue, setInputValue] = useState<{ [key: string]: string }>({});

  const user = useOutletContext<User | null>();

  const { state } = useLocation();
  const navigate = useNavigate();

  const { show } = useNotifyStore();

  const queryClient = useQueryClient();

  const { mutate: deletePosts } = useMutation({
    mutationFn: deleteAllPostByUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      show({ message: 'delete all my post.' });
    },
  });

  const { mutate: deleteComments } = useMutation({
    mutationFn: deleteAllCommentByUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comment'] });
      show({ message: 'delete all my comment.' });
    },
  });

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    setInputValue({ ...inputValue, [name]: value });
  };

  const updateAccount = async (user: User, password: string, newPassword: string) => {
    if (!validatePassword(newPassword)) {
      show({ message: '영어 소문자와 숫자 6자리 이상' });
      return;
    }
    const isCredential = await reauthenticate(user, password);
    if (isCredential) {
      updatePassword(user, newPassword)
        .then(() => {
          show({ message: 'update complete.' });
          setMode('default');
        })
        .catch((error) => show({ message: error.message }));
    } else {
      show({ message: 'wrong password.' });
    }
  };

  const deleteAccount = async (user: User, email: string, password: string) => {
    if (user.email !== email) return;
    const isCredential = await reauthenticate(user, password);
    if (isCredential) {
      deleteUser(user)
        .then(() => {
          show({ message: 'delete complete.' });
          navigate('/');
        })
        .catch((error) => show({ message: error.message }));
    } else {
      show({ message: 'wrong account information.' });
    }
  };

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // console.log(inputValue);
    if (!user) return;
    if (mode === 'update') {
      const { confirm, newPw } = inputValue;
      updateAccount(user, confirm, newPw);
    }
    if (mode === 'delete') {
      const { email, password } = inputValue;
      deleteAccount(user, email, password);
    }
  };

  if (!state) return <Navigate to="/" replace={true} />;
  return (
    <div className={styles.container}>
      <div className={styles.topics}>
        <h4>private topics</h4>
        <PostList access={false} />
      </div>
      {mode === 'default' && (
        <div className={styles.buttons}>
          <button
            onClick={() => {
              user && confirm('are you sure you want to delete it?') && deletePosts(user.uid);
            }}>
            delete all post
          </button>
          <button
            onClick={() => {
              user && confirm('are you sure you want to delete it?') && deleteComments(user.uid);
            }}>
            delete all comment
          </button>
          <button onClick={() => setMode('update')}>update password</button>
          <button onClick={() => setMode('delete')}>delete account</button>
        </div>
      )}
      {mode === 'update' && (
        <form onSubmit={onSubmit} className={styles.form}>
          <label htmlFor="confirm">confirm password</label>
          <input name="confirm" id="confirm" type="password" value={inputValue.confirm || ''} onChange={onChange} />
          <label htmlFor="newPw">new password</label>
          <input name="newPw" id="newPw" type="password" value={inputValue.newPw || ''} onChange={onChange} />
          <button>update password</button>
          <button
            onClick={() => {
              setMode('default');
              setInputValue({});
            }}
            className={styles.close}
          />
        </form>
      )}
      {mode === 'delete' && (
        <form className={styles.form} onSubmit={onSubmit}>
          <label htmlFor="email">email address</label>
          <input name="email" id="email" type="text" value={inputValue.email || ''} onChange={onChange} />
          <label htmlFor="password">password</label>
          <input name="password" id="password" type="password" value={inputValue.password || ''} onChange={onChange} />
          <button>delete account</button>
          <button
            onClick={() => {
              setMode('default');
              setInputValue({});
            }}
            className={styles.close}
          />
        </form>
      )}
    </div>
  );
};

export default MyPage;
