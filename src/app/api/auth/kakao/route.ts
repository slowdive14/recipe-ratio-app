import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    // Initialize Admin App lazily
    getFirebaseAdminApp();

    try {
        const { accessToken, code } = await req.json();
        let kakaoAccessToken = accessToken;


        // If authorization code provided, exchange for access token
        if (code) {
            const tokenResponse = await fetch('https://kauth.kakao.com/oauth/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
                },
                body: new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY!,
                    redirect_uri: `${req.headers.get('origin')}/auth/kakao/callback`,
                    code: code,
                }),
            });

            if (!tokenResponse.ok) {
                const err = await tokenResponse.json();
                console.error('Kakao Token Exchange Error:', err);
                return NextResponse.json({ error: 'Failed to exchange token' }, { status: 400 });
            }

            const tokenData = await tokenResponse.json();
            kakaoAccessToken = tokenData.access_token;
        }

        if (!kakaoAccessToken) {
            return NextResponse.json({ error: 'Access token or code required' }, { status: 400 });
        }

        // 1. Verify token with Kakao (Get User Info)
        const kakaoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${kakaoAccessToken}`,
            },
        });

        if (!kakaoResponse.ok) {
            const errorData = await kakaoResponse.json();
            console.error('Kakao API Error:', errorData);
            return NextResponse.json({ error: 'Invalid Kakao token' }, { status: 401 });
        }

        const kakaoUser = await kakaoResponse.json();
        const kakaoUserId = kakaoUser.id;
        const email = kakaoUser.kakao_account?.email;
        const nickname = kakaoUser.properties?.nickname;
        const profileImage = kakaoUser.properties?.profile_image;

        if (!kakaoUserId) {
            return NextResponse.json({ error: 'Failed to get Kakao User ID' }, { status: 400 });
        }

        // 2. Create or Get Firebase User
        // We'll use 'kakao:' prefix for UID to avoid collisions
        const uid = `kakao:${kakaoUserId}`;
        const auth = getAuth();

        try {
            await auth.getUser(uid);
        } catch (error) {
            // User doesn't exist, create new one
            // Note: Firebase Admin create user doesn't support setting 'providerData' directly for custom auth
            // We set basic profile info.
            await auth.createUser({
                uid: uid,
                email: email,
                displayName: nickname,
                photoURL: profileImage,
            });
        }

        // 3. Create Custom Token
        const firebaseCustomToken = await auth.createCustomToken(uid, {
            provider: 'kakao'
        });

        return NextResponse.json({ firebaseCustomToken });

    } catch (error) {
        console.error('Kakao Auth Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
