import type { MetaFunction } from '@remix-run/node';
import styles from './home.scss?url';
import PostPreview from '~/component/PostPreview';

export const meta: MetaFunction = () => {
  return [{ title: 'Blog' }, { name: 'Blog', content: 'personal commentary' }];
};

export const links = () => [{ rel: 'stylesheet', href: styles }];

export default function Index() {
  return (
    <div className="container">
      <h4>Latest Topics</h4>
      <PostPreview />
    </div>
  );
}
