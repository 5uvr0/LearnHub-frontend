// @ts-check
import { test, expect } from '@playwright/test';
import { HttpStatusCode } from 'axios';

const BASE_URL = 'http://localhost:8090/auth';

test.describe('Admin API Endpoints', () => {
    let accessToken;
    let testUserAccessToken;
    const adminUserEmail = "admin@gmail.com";
    const adminUserPassword = "Demo@123";
    const testUserEmail = "playwright.user@example.com";
    let testUserId;
    let testUserAccountStatus;

    const getAllUsers = async (request, token) => {
        const response = await request.get(`${BASE_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        expect(response.status()).toBe(HttpStatusCode.Ok);
        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();

        return users;
    };


    test.beforeAll(async ({ request }) => {
        // ------------------------ Test User Side ------------------------
        const registerPayload = {
            email: testUserEmail,
            password: 'Demo@123',
            role: 'STUDENT'
        };

        const registerResponse = await request.post(`${BASE_URL}/api/register`, { data: registerPayload });
        const registerJson = await registerResponse.json();

        const verificationToken = registerJson.message;

        await request.get(`${BASE_URL}/api/verify-email?token=${verificationToken}`);
        // We don't have to check for the expected returns because there maybe multiple runs of the test and if any error is encountered in the midway it might result in a persistent user entry at the db side

        const testUserLoginPayload = {
            email: testUserEmail,
            password: 'Demo@123'
        };
        const loginResponse = await request.post(`${BASE_URL}/api/login`, { data: testUserLoginPayload });
        const loginJson = await loginResponse.json();
        
        testUserAccessToken = loginJson.accessToken;

        expect(testUserAccessToken).toBeTruthy();

        // ---------------------- Admin Side --------------------
        const adminPayload = {
            email: adminUserEmail,
            password: adminUserPassword,
        };

        const adminLoginResponse = await request.post(`${BASE_URL}/api/login`, { data: adminPayload });
        const adminLoginJson = await adminLoginResponse.json();

        accessToken = adminLoginJson.accessToken;

        // --------------- Fetch all users and extract testUserId ------------------
        const users = await getAllUsers(request, accessToken);
        const testUser = users.find(u => u.email === testUserEmail);

        testUserId = testUser?.id;
        expect(testUserId).toBeTruthy();

        testUserAccountStatus = testUser.enabled;
    });

    test.afterAll(async ({ request }) => {
        await request.delete(`${BASE_URL}/api/delete`, { data: { accessToken: testUserAccessToken } });
    });

    test('should deny access to non-admin users', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/admin/users`, {
            headers: {
                Authorization: `Bearer ${testUserAccessToken}`
            }
        });

        expect(response.status()).toBe(HttpStatusCode.Unauthorized);
    });

    test('should get all users with a valid admin token', async ({ request }) => {
        const users = await getAllUsers(request, accessToken);
        expect(users.length).toBeGreaterThan(0);
    });

    test('should get admin details with a valid token', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/admin/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        expect(response.status()).toBe(HttpStatusCode.Ok);
        const user = await response.json();
        expect(user.role).toBe('ADMIN');
    });

    test('should get a specific user by ID with a valid admin token', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/admin/user/${testUserId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        expect(response.status()).toBe(HttpStatusCode.Ok);
        const user = await response.json();
        expect(user.email).toBe(testUserEmail);
    });

    test('should delete a user as an admin', async ({ request }) => {
        const deleteResponse = await request.delete(`${BASE_URL}/admin/delete-user/${testUserId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        expect(deleteResponse.status()).toBe(HttpStatusCode.Ok);
    });

    test('should toggle user status as an admin', async ({ request }) => {
        const toggleResponse = await request.put(`${BASE_URL}/admin/user/${testUserId}/toggle-status`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        expect(toggleResponse.status()).toBe(HttpStatusCode.Ok);
        const user = await toggleResponse.json();

        expect(user.enabled).toBe(!testUserAccountStatus);
    });
});
