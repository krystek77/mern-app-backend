/* eslint-disable no-useless-escape */
export const INPUT_PATTERNS = {
  EMAIL:
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
  PASSWORD:
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PRICE: /^[1-9]+[0-9]*\.?[0-9]*$/gm,
  NIP: /[0-9]{10}/gm,
  WEIGHT: /(^[0]{1}\.[0-9]*$)|(^[0]?[1-9]+\.?[0-9]*$)/gm,
  MOBILE_PHONE: /^\+{1}\d{2}\s{1}\d{3}-\d{3}-\d{3}$/gm,
  PHONE: /^\+{1}\d{2,3}\s{1}\d{2}-\d{3}-\d{2}-\d{2}$/gm,
  ZIP_CODE: /^\d{2}-\d{3}$/gm,
  WWW: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
  NAME: /^[a-zA-Ząćśźżęłó]{3,}$/gm,
  LASTNAME: /^[a-zA-Ząćśźżęłó]{3,}$/gm,
};

export default INPUT_PATTERNS;
