import Editor from 'app/component/Editor';
import styles from './edit.scss?url';
import { useOutletContext } from '@remix-run/react';
import { User } from 'firebase/auth';

export const meta = () => {
  return [{ title: 'Blog - Edit' }, { name: 'edit' }];
};

export const links = () => [{ rel: 'stylesheet', href: styles }];

const Edit = () => {
  const user = useOutletContext<User | null>();
  const userInfo = { uid: String(user?.uid), email: String(user?.email) };

  return (
    <div className="container">
      <h4>edit</h4>
      {user && <Editor user={userInfo} />}
    </div>
  );
};

export default Edit;
