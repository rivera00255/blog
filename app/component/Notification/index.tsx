import { useEffect, useRef } from 'react';
import styles from './notify.module.scss';
import { useNotifyStore } from '~/store/notify';

const Notification = ({ message }: { message: string }) => {
  const timer = useRef<NodeJS.Timeout>(null);
  const { notify, show, close } = useNotifyStore();

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);

    const setTimer = setTimeout(() => {
      close();
    }, 2000);
  }, [show]);

  return (
    <div className={styles.notify}>
      <p>{message}</p>
      <button onClick={() => close()}>✕</button>
    </div>
  );
};

export default Notification;
