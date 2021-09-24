import KJUR from 'jsrsasign';

export const validateEmail = (email) => {
  const re = /^[a-z0-9.d%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
  return re.test(String(email).toLowerCase());
};

export const validateMobile = (mobile) => {
  const re = /^(\+84|84|0|1){1}([0-9]{7,10})\b$/i;
  return re.test(String(mobile).toLowerCase());
};
export const userId = () => {
  const localStorageToken = localStorage.getItem('token');
  if (localStorageToken === 'undefined' || !localStorageToken) {
    return 0;
  }
  const token = localStorageToken !== 'undefined' ? localStorageToken : null;
  const decodedToken = KJUR.jws.JWS.parse(token);
  if (decodedToken && decodedToken.payloadObj.id) {
    const { id } = decodedToken.payloadObj;
    return id;
  }
  return 0;
};

export const userGroupId = () => {
  const localStorageToken = localStorage.getItem('token');
  if (localStorageToken === 'undefined' || !localStorageToken) {
    return 0;
  }
  const token = localStorageToken !== 'undefined' ? localStorageToken : null;
  const decodedToken = KJUR.jws.JWS.parse(token);
  if (decodedToken && decodedToken.payloadObj.userGroupId) {
    const { userGroupId } = decodedToken.payloadObj;
    return userGroupId;
  }
  return 0;
};
