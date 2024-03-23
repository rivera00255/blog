import Editor from 'app/component/Editor';
import styles from './edit.scss?url';

export const meta = () => {
  return [{ title: 'Blog - Edit' }, { name: 'edit' }];
};

export const links = () => [{ rel: 'stylesheet', href: styles }];

const Edit = () => {
  return (
    <div className="container">
      <h4>edit</h4>
      <Editor />
    </div>
  );
};

export default Edit;
