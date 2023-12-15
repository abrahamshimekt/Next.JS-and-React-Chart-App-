// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const currentUser = request.cookies.get("token")?.value;
//   if (currentUser) {
//     return NextResponse.next();
//   }

//   return NextResponse.redirect(new URL("/auth/login", request.url));
// }


// export const config = {
//   matcher: [
//      '//:path*',
//      '/email-sender/:path*',
//     ]
// }


import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get("token")?.value;
  if (currentUser) {
    const response =  NextResponse.next();
    response.headers.set("x-middleware-cache", "no-cache");
    return response
  }
  
  const response =  NextResponse.redirect(new URL("/auth/login", request.url));
  response.headers.set("x-middleware-cache", "no-cache");
  return response
}


export const config = {
  matcher: [
     '//:path*',
     '/email-sender/:path*',
    ]
}



