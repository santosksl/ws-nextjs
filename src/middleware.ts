import { NextRequest, NextResponse } from 'next/server';
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth.token');
    const loginURL = new URL('/login', request.url);
    const testURL = new URL('/test', request.url);

    if (!token) {
        if (request.nextUrl.pathname === '/login') {
            return NextResponse.next()
        }

        return NextResponse.redirect(loginURL)
    }

    if (request.nextUrl.pathname === '/login') {
        return NextResponse.redirect(testURL)
    }
}
 
export const config = {
    matcher: ['/login', '/test']
}