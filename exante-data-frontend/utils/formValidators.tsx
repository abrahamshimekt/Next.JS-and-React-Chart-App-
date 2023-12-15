// emailVerification.tsx

export function isPossibleEmail(email: string): boolean {
    // Simple regular expression to check for basic structure

    if(email.length == 0){
      return false
    }

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  
    // Check if the string matches the regex
    return emailRegex.test(email);
  }

export function validPasswordCheck(password: string): string {
  if(password.length < 8){
    return "Password length must be more than 8"
  }
  return ""

}

export interface SignupFormErrorType {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}


export function signupFormValidator(name: string, email:string, password: string, confirmPassword: string): SignupFormErrorType{
  const res: SignupFormErrorType = {name: "", email: "", password: "", confirmPassword: ""}
  if(name.length == 0){
    res.name = "Name is required"
  }
  else if(name.length < 4){
    res.name = "Name must be more than 4 characters"
  }
  if(email.length == 0){
    res.email = "Email is required"
  }
  if(password.length == 0){
    res.password = "Password is required"
  }
  else if(password.length < 8){
    res.password = "Password must be more than 8 characters"
  }
  if(confirmPassword.length == 0){
    res.confirmPassword = "Confirm password is required"
  }
  else if(confirmPassword !== password){
    res.confirmPassword = "password does not match"
  }

  return res
}
  