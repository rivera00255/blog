import { Form, json, useActionData, useNavigate } from '@remix-run/react';
import styles from './login.scss?url';
import { useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '~/lib/firebase';
import { validateEmail, validatePassword } from '~/utilities';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const errors = { email: false, password: false };

  if (!validateEmail(email)) errors.email = true;
  if (!validatePassword(password)) errors.password = true;
  if (Object.values(errors).filter((error) => error === true).length > 0) {
    return json(errors);
  }

  return json({ email, password });
};

const Login = () => {
  const [mode, setMode] = useState('login');

  const actionData = useActionData<typeof action>();

  const navigate = useNavigate();

  useEffect(() => {
    if (actionData && typeof actionData?.email === 'string') {
      const email = actionData.email;
      const password = actionData.password;
      if (mode === 'login') {
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            navigate('/');
            return userCredential.user;
          })
          .catch((error) => alert(error.message));
      }
      if (mode === 'join') {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            navigate('/');
            return userCredential.user;
          })
          .catch((error) => alert(error.message));
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
        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="영어 소문자와 숫자 6자리 이상"
          className={actionData?.password === true ? 'error' : ''}
        />
        <button type="submit">{mode}</button>
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
