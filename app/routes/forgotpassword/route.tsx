import { sendPasswordResetEmail } from 'firebase/auth';
import { useRef } from 'react';
import { auth } from '~/lib/firebase';
import { useNotifyStore } from '~/store/notify';
import { validateEmail } from '~/utilities';
import styles from './forgotPassword.module.scss';

const ForgotPassword = () => {
  const emailRef = useRef<HTMLInputElement>(null);

  const { show } = useNotifyStore();

  const sendResetEmail = () => {
    if (emailRef.current && emailRef.current.value.trim().length > 0) {
      const inputValue = emailRef.current.value.trim();
      if (!validateEmail(inputValue)) return;
      sendPasswordResetEmail(auth, inputValue)
        .then(() => {
          // Password reset email sent!
          // ..
        })
        .catch((error) => show({ message: error.message }));
    }
  };

  return (
    <div className={styles.container}>
      <div>
        <h4>reset password</h4>
        <label htmlFor="email">email address</label>
        <input type="text" name="email" id="email" ref={emailRef} />
        <button onClick={() => sendResetEmail()}>send email</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
