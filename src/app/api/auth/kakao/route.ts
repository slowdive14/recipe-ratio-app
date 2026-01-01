import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirebaseAdminApp } from '@/lib/firebase-admin';

// Initialize Admin App
getFirebaseAdminApp();

export async function POST(req: NextRequest) {
    try {
        const { accessToken } = await req.json();

        if (!accessToken) {
            return NextResponse.json({ error: 'Access token required' }, { status: 400 });
        }

        // 1. Verify token with Kakao
        const kakaoResponse = await fetch('https://kapi.kakao.com/v2/user/me', {
            headers: {
                Authorization: `Bearer ${accessToken}`,
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
