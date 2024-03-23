import { Form, json, useActionData, useNavigate } from '@remix-run/react';
import styles from './login.scss?url';

export const links = () => [{ rel: 'stylesheet', href: styles }];

const validateEmail = (value: string) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  if (emailRegex.test(value)) return true;
  return false;
};

const validatePassword = (value: string) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{6,20}$/;
  if (passwordRegex.test(value)) return true;
  return false;
};

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const errors = { email: false, password: false };
  if (!validateEmail(email)) errors.email = true;
  if (!validatePassword(password)) errors.password = true;
  return json({ ...errors });
};

const Login = () => {
  const actionData = useActionData<typeof action>();
  // console.log(actionData);
  const navigate = useNavigate();

  return (
    <div className="container">
      <button className="backButton" onClick={() => navigate(-1)}>
        ← back
      </button>
      <Form className="form" method="post">
        <h4>login</h4>
        <label htmlFor="email">email</label>
        <input
          type="text"
          name="email"
          placeholder="이메일"
          className={actionData && actionData.email === true ? 'error' : ''}
        />
        <label htmlFor="password">password</label>
        <input
          type="password"
          name="password"
          placeholder="영어 소문자와 숫자 6자리 이상"
          className={actionData && actionData.password === true ? 'error' : ''}
        />
        <button type="submit">login</button>
      </Form>
      <div className="join">
        <button>join us</button>
      </div>
    </div>
  );
};

export default Login;
