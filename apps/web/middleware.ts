import { NextResponse } from "next/server";

// type RoutePermissions = Record<
//   string,
//   {
//     requireAuth: boolean;
//     allowedRoles?: Array<UserRole>;
//   }
// >;

// const routePermissions: RoutePermissions = {
//   "/app": {
//     requireAuth: true,
//   },
// };

// export async function middleware(request: NextRequest) {
export async function middleware() {
  console.log("middleware triggered");

  // const { pathname } = request.nextUrl;

  // const matchingRoute = Object.keys(routePermissions).find(
  //   (route) => pathname === route || pathname.startsWith(`${route}/`),
  // );

  // if (!matchingRoute) {
  //   return NextResponse.next();
  // }

  // const permissions = routePermissions[matchingRoute];

  // if (permissions && permissions.requireAuth) {
  //   const authToken = request.cookies.get("auth-token")?.value;

  //   if (!authToken) {
  //     return NextResponse.redirect(new URL(ROUTES.AUTH_SIGN_IN, request.url));
  //   }

  //   if (permissions.allowedRoles && permissions.allowedRoles.length > 0) {
  //     try {
  //       const userData = await getMeServer();
  //       const userRole = userData.role as UserRole;

  //       if (!permissions.allowedRoles.includes(userRole)) {
  //         return NextResponse.redirect(
  //           new URL(ROUTES.AUTH_SIGN_IN, request.url),
  //         );
  //       }
  //     } catch {
  //       const response = NextResponse.redirect(
  //         new URL(ROUTES.AUTH_SIGN_IN, request.url),
  //       );
  //       response.cookies.delete("auth-token");
  //       return response;
  //     }
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/app/:path*"],
};
