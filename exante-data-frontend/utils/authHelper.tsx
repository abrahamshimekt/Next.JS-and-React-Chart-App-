import Cookies from "js-cookie";

export const  getToken =()=> {
  
  const token = Cookies.get("token");
  return token;
}

export const removeToken = (): void => {
  Cookies.remove("token");
};

export const setToken = (val: string) => {
  Cookies.set("token", val);
};
