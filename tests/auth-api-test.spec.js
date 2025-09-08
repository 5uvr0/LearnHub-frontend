import { test, expect } from '@playwright/test';
import { HttpStatusCode } from 'axios';

const BASE_URL = 'http://localhost:8090/auth';

test.describe.serial('Auth API Endpoints', () => {
    let accessToken;
    let refreshToken;
    const testUserEmail = "playwright.user@example.com";
    const testUserPassword = "Demo@123";

    test('should register an user successfully', async ({ request }) => {
        const registerPayload = {
            email: testUserEmail,
            password: testUserPassword,
            role: 'STUDENT'
        };

        const registerResponse = await request.post(`${BASE_URL}/api/register`, { data: registerPayload });
        const registerJson = await registerResponse.json();

        const verificationToken = registerJson.message;
        console.log("Provided verification token:", verificationToken);

        const verifyResponse = await request.get(`${BASE_URL}/api/verify-email?token=${verificationToken}`);

        expect(verifyResponse.status()).toBe(HttpStatusCode.Ok);
    });

    test('should log in a verified user successfully', async ({ request }) => {
        const loginResponse = await request.post(`${BASE_URL}/api/login`, {
            data: { email: testUserEmail, password: testUserPassword }
        });
        const jsonResponse = await loginResponse.json();

        expect(loginResponse.status()).toBe(HttpStatusCode.Ok);
        expect(jsonResponse.accessToken).toBeTruthy();
        expect(jsonResponse.refreshToken).toBeTruthy();

        expect(jsonResponse.email).toBe(testUserEmail);

        expect(jsonResponse.role).toBe('STUDENT');

        accessToken = jsonResponse.accessToken;
        refreshToken = jsonResponse.refreshToken;
    });

    // test('should update a user successfully with a valid token', async ({ request }) => {
    //     const updatePayload = {
    //         password: 'Secret@123',
    //         role: 'STUDENT',

    //     };

    //     const updateResponse = await request.put(`${BASE_URL}/api/update-user`, {
    //         data: updatePayload,
    //         headers: { Authorization: `Bearer ${accessToken}` }
    //     });

    //     const jsonResponse = await updateResponse.json();
    //     expect(updateResponse.status()).toBe(HttpStatusCode.Ok);
    //     expect(jsonResponse.message).toBe('User updated successfully.');
    // });

    test('should refresh a token successfully', async ({ request }) => {
        const refreshResponse = await request.post(`${BASE_URL}/api/refresh`, {
            data: { refreshToken: refreshToken }
        });

        const jsonResponse = await refreshResponse.json();
        expect(refreshResponse.status()).toBe(HttpStatusCode.Ok);
        expect(jsonResponse.accessToken).toBeTruthy();
        expect(jsonResponse.refreshToken).toBeTruthy();
    });

    test('should delete a user successfully', async ({ request }) => {
        const deleteResponse = await request.delete(`${BASE_URL}/api/delete`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        const jsonResponse = await deleteResponse.json();
        expect(deleteResponse.status()).toBe(HttpStatusCode.Ok);
        expect(jsonResponse.message).toBe('User deleted successfully');
    });

});
