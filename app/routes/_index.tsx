import styles from './home.scss?url';
import PostPreview from '../component/PostPreview';
import { useOutletContext } from '@remix-run/react';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function Index() {
  // const session = useOutletContext();
  // console.log(session);

  return (
    <div className="container">
      <h4>latest topics</h4>
      <PostPreview />
    </div>
  );
}
