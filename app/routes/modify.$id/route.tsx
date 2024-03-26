import { User } from '@firebase/auth';
import { useOutletContext, useParams } from 'react-router';
import Editor from '~/component/Editor';
import styles from './modify.module.scss';

const Modify = () => {
  const user = useOutletContext<User | null>();
  const userInfo = { uid: String(user?.uid), email: String(user?.email) };
  const params = useParams();

  return (
    <div className={styles.container}>
      <h4>modify</h4>
      {user && <Editor user={userInfo} id={String(params.id)} />}
    </div>
  );
};

export default Modify;
