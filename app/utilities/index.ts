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

const extractImageUrl = (htmlString: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const imgTags = doc.querySelectorAll('img');
  const images = Array.from(imgTags).map((img) => img.src);
  return images;
};

export { validateEmail, validatePassword, extractImageUrl };
