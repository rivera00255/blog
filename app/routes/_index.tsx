import { json } from '@remix-run/node';
import styles from './home.scss?url';
import PostList from '~/component/PostList';
import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query';
import { getPost } from '~/service';
import { useLoaderData } from '@remix-run/react';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export const loader = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: () => getPost(),
  });

  return json({ dehydratedState: dehydrate(queryClient) });
};

export default function Index() {
  const { dehydratedState } = useLoaderData<typeof loader>();

  return (
    <div className="container">
      <h4>latest topics</h4>
      <HydrationBoundary state={dehydratedState}>
        <PostList />
      </HydrationBoundary>
    </div>
  );
}
