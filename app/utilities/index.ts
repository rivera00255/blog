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

export { validateEmail, validatePassword };
