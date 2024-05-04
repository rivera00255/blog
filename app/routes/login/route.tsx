import { Form, json, useActionData, useNavigate } from '@remix-run/react';
import styles from './login.scss?url';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { validateEmail, validatePassword } from '~/utilities';
import { useNotifyStore } from '~/store/notify';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const mode = String(formData.get('mode'));
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const username = String(formData.get('username'));
  const passwordConfirm = String(formData.get('passwordConfirm'));
  const errors = { email: false, password: false, username: false, passwordConfirm: false };

  if (!validateEmail(email)) errors.email = true;
  if (!validatePassword(password)) errors.password = true;
  if (mode === 'join') {
    if (username.length < 1) errors.username = true;
    if (password !== passwordConfirm) errors.passwordConfirm = true;
  }
  if (Object.values(errors).filter((error) => error === true).length > 0) {
    return json(errors);
  }

  return json({ email, password, username, passwordConfirm });
};

const Login = () => {
  const [mode, setMode] = useState<'login' | 'join'>('login');

  const actionData = useActionData<typeof action>();

  const navigate = useNavigate();

  const { show } = useNotifyStore();

  useEffect(() => {
    if (actionData && typeof actionData?.email === 'string') {
      const email = actionData.email;
      const password = actionData.password;
      if (mode === 'login') {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            navigate('/');
            show({ message: 'welcome!' });
            return userCredential.user;
          })
          .catch((error) => show({ message: error.message }));
      }
      if (mode === 'join') {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            updateProfile(userCredential.user, {
              displayName: actionData.username,
            });
            navigate('/');
            return userCredential.user;
          })
          .catch((error) => show({ message: error.message }));
      }
    }
  }, [actionData]);

  return (
    <div className="container">
      <button className="backButton" onClick={() => navigate(-1)}>
        ← back
      </button>
      <Form className="form" method="post">
        <h4>{mode}</h4>
        <input type="text" name="mode" id="mode" hidden value={mode} readOnly />
        <label htmlFor="email">email</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="이메일"
          className={actionData?.email === true ? 'error' : ''}
        />
        {mode === 'join' && (
          <>
            <label htmlFor="email">username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="닉네임"
              className={actionData?.username === true ? 'error' : ''}
            />
          </>
        )}
        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="영어 소문자와 숫자 6자리 이상"
          className={actionData?.password === true ? 'error' : ''}
        />
        {mode === 'join' && (
          <>
            <label htmlFor="passwordConfirm">confirm password</label>
            <input
              type="password"
              name="passwordConfirm"
              id="passwordConfirm"
              placeholder="패스워드 확인"
              className={actionData?.passwordConfirm === true ? 'error' : ''}
            />
          </>
        )}
        <button type="submit">{mode}</button>
        <button type="button" className="forgot" onClick={() => navigate('/forgotpassword')}>
          forgot password?
        </button>
      </Form>
      <div className="join">
        <button onClick={() => setMode((prev) => (prev === 'login' ? 'join' : 'login'))}>
          {mode === 'login' ? 'join us' : 'login'}
        </button>
      </div>
    </div>
  );
};

export default Login;
