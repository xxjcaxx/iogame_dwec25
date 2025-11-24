
/**
 * @vitest-environment jsdom
 */

import { beforeEach, describe, expect, test, vi, afterEach, beforeAll, afterAll, afterEach } from "vitest";
import { SUPABASE_KEY, SUPABASE_URL } from "../src/env";

import * as Supaservice from "../src/services/supaservice"

import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const loginResponseMock = { "access_token": "short mocked token", "token_type": "bearer", "expires_in": 3600, "expires_at": 1762794701, "refresh_token": "npuck2poaiqs", "user": { "id": "7423e4cd-30ec-4f40-a2ea-39eadae322d9", "aud": "authenticated", "role": "authenticated", "email": "jocasal@gmail.com", "email_confirmed_at": "2025-10-20T07:17:22.238399Z", "phone": "", "confirmation_sent_at": "2025-10-20T07:16:50.532234Z", "confirmed_at": "2025-10-20T07:17:22.238399Z", "last_sign_in_at": "2025-11-10T16:11:41.203736426Z", "app_metadata": { "provider": "email", "providers": ["email"] }, "user_metadata": { "email": "xxxx@gmail.com", "email_verified": true, "phone_verified": false, "sub": "7423e4cd-30ec-4f40-a2ea-39eadae322d9" }, "identities": [{ "identity_id": "fbbc1c34-3b20-42ee-a809-6f65759c428b", "id": "7423e4cd-30ec-4f40-a2ea-39eadae322d9", "user_id": "7423e4cd-30ec-4f40-a2ea-39eadae322d9", "identity_data": { "email": "xxxx@gmail.com", "email_verified": true, "phone_verified": false, "sub": "7423e4cd-30ec-4f40-a2ea-39eadae322d9" }, "provider": "email", "last_sign_in_at": "2025-10-20T07:16:50.509455Z", "created_at": "2025-10-20T07:16:50.509509Z", "updated_at": "2025-10-20T07:16:50.509509Z", "email": "jocasal@gmail.com" }], "created_at": "2025-10-20T07:16:50.471883Z", "updated_at": "2025-11-10T16:11:41.261941Z", "is_anonymous": false }, "weak_password": null };

const loginInvalidResponseMock = { "code": 400, "error_code": "invalid_credentials", "msg": "Invalid login credentials" };

const registerResponseMock = { "id": "52e35aa6-2ac3-41d0-bb6f-695e75aede29", "aud": "authenticated", "role": "authenticated", "email": "xxxx@yahoo.es", "phone": "", "confirmation_sent_at": "2025-11-10T16:37:36.80305987Z", "app_metadata": { "provider": "email", "providers": ["email"] }, "user_metadata": { "email": "xxxx@yahoo.es", "email_verified": false, "phone_verified": false, "sub": "52e35aa6-2ac3-41d0-bb6f-695e75aede29" }, "identities": [{ "identity_id": "f8c2efd9-b103-4ec8-a416-4675902c06fe", "id": "52e35aa6-2ac3-41d0-bb6f-695e75aede29", "user_id": "52e35aa6-2ac3-41d0-bb6f-695e75aede29", "identity_data": { "email": "xxxx@yahoo.es", "email_verified": false, "phone_verified": false, "sub": "52e35aa6-2ac3-41d0-bb6f-695e75aede29" }, "provider": "email", "last_sign_in_at": "2025-11-10T16:37:36.789258187Z", "created_at": "2025-11-10T16:37:36.78989Z", "updated_at": "2025-11-10T16:37:36.78989Z", "email": "xxxx@yahoo.es" }], "created_at": "2025-11-10T16:37:36.709879Z", "updated_at": "2025-11-10T16:37:37.357662Z", "is_anonymous": false };



const handlers = [
    http.post('https://mockurl.supabase.co/auth/v1/token', async ({ request }) => {

        const url = new URL(request.url)
        const grantType = url.searchParams.get('grant_type')

        const data = await request.json();
        const headers = Object.fromEntries(request.headers.entries());

        if (data.password === "mala password") {
            return HttpResponse.json(loginInvalidResponseMock)
        }

        return HttpResponse.json({ data, headers, grantType }); // retorna un mix per provar que està tot
    }),
    http.get(`https://mockurlmala.supabase.co/auth/v1/token`, () => {
        return HttpResponse.error();
    }),
    http.post(`${SUPABASE_URL}/auth/v1/token`, async ({ request }) => {
        const url = new URL(request.url)
        const grantType = url.searchParams.get('grant_type')
        const data = await request.json();
        if (data.password === "mala password") {
            return HttpResponse.json(loginInvalidResponseMock)
        }
        return HttpResponse.json(
            loginResponseMock
        );
    }),
    http.post(`${SUPABASE_URL}/auth/v1/signup`, async ({ request }) => {
        const data = await request.json();
        return HttpResponse.json(registerResponseMock);
    }),
    http.get(`${SUPABASE_URL}/rest/v1/mockTable`, async ({ request }) => {
        const url = new URL(request.url)
        const id = url.searchParams.get('id')
        const headers = Object.fromEntries(request.headers.entries());
        return HttpResponse.json({ id, name: "aaa", headers });
    }),



];

const server = setupServer(...handlers);

describe("Supaservice tests unitaris", () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    describe("getBearer", () => {
        afterEach(() => {
            localStorage.removeItem("access_token");
        });
        test("getBearer ha de retornar un bearer si està en localstorage", () => {
            localStorage.setItem("access_token", "1234");
            expect(Supaservice.getBearer()).toBe("Bearer 1234")
        });
        test("getBearer ha de retornar un bearer si no està en localstorage", () => {
            expect(Supaservice.getBearer()).toBe("Bearer " + SUPABASE_KEY);
        });
    });
    describe("headerFactory", () => {
        test("headerFactory ha de retornar un header", () => {
            expect(Supaservice.headerFactory()).toBeInstanceOf(Headers);
            expect(Supaservice.headerFactory({})).toBeInstanceOf(Headers);
            expect(Supaservice.headerFactory({ contentType: "application/json" })).toBeInstanceOf(Headers);
            expect(Supaservice.headerFactory({ Prefer: "return=representation" })).toBeInstanceOf(Headers);
            expect(Supaservice.headerFactory({ apikey: "1234" })).toBeInstanceOf(Headers);
            expect(Supaservice.headerFactory({ Authorization: "1234" })).toBeInstanceOf(Headers);
        });
        test("headerFactory ha de retornar un header determinat en funció dels paràmetres", () => {
            expect(Supaservice.headerFactory({ contentType: "application/json" }).get("Content-Type")).toBe("application/json");
            expect(Supaservice.headerFactory({ Prefer: "return=representation" }).get("Prefer")).toBe("return=representation");
            expect(Supaservice.headerFactory({ apikey: "1234" }).get("apikey")).toBe("1234");
            expect(Supaservice.headerFactory({ Authorization: "1234" }).get("Authorization")).toBe("1234");
            expect(Object.fromEntries(Supaservice.headerFactory({}).entries()))  // Si no li passem res
                .toEqual({ apikey: SUPABASE_KEY, authorization: 'Bearer ' + SUPABASE_KEY, 'content-type': 'application/json' });
            expect(Object.fromEntries(Supaservice.headerFactory({ apikey: "1234", Authorization: "Bearer 1234", contentType: "application/json", Prefer: "return=representation" }).entries())) // Si li passem tot
                .toEqual({ apikey: "1234", authorization: 'Bearer 1234', 'content-type': 'application/json', prefer: 'return=representation' });

        });
    });
    describe("fetchSupabase", () => {
        test("fetchSupabase ha de retornar un json", async () => {
            const response = await Supaservice.fetchSupabase("https://mockurl.supabase.co/auth/v1/token?grant_type=password", {
                method: "post",
                headers: Supaservice.headerFactory({}),
                body: JSON.stringify({ email: "aaa", password: "bbb" })
            });
            expect(response).toBeInstanceOf(Object);
            expect(response).toEqual({ // En realitat dona igual el que retorne, la funció extreu el seu json
                data: { email: 'aaa', password: 'bbb' },
                headers: {
                    apikey: SUPABASE_KEY,
                    authorization: `Bearer ${SUPABASE_KEY}`,
                    'content-type': 'application/json'
                },
                grantType: 'password'
            });
        });
        test("fetchSupabase ha de retornar un error si supabase retorna un error", async () => {
            try {
                const response = await Supaservice.fetchSupabase("https://mockurl.supabase.co/auth/v1/token?grant_type=password", {
                    method: "post",
                    headers: Supaservice.headerFactory({}),
                    body: JSON.stringify({ email: "aaa", password: "mala password" })
                });
            }
            catch (error) {
                expect(error).toEqual(loginInvalidResponseMock);
            }
        });
        test("fetchSupabase ha de retornar un error si supabase no contesta", async () => {
            try {
                // sols importa que siga get i la url mockeada
                const response = await Supaservice.fetchSupabase("https://mockurlmala.supabase.co/auth/v1/token?grant_type=password");
            }
            catch (error) {
                expect(error).toBeInstanceOf(TypeError);
                expect(error.message).toBe("Failed to fetch");
            }
        });

    });
    describe("loginSupabase", () => {
        test("loginSupabase ha de retornar un json", async () => {
            const response = await Supaservice.loginSupabase({ email: "aaa", password: "bbb" });
            expect(response).toBeInstanceOf(Object);
            expect(response).toEqual(loginResponseMock);
        });
        test("loginSupabase ha de retornar un Error", async () => {
            try {
                const response = await Supaservice.loginSupabase({ email: "aaa", password: "mala password" });
            }
            catch (error) {
                expect(error).toEqual(loginInvalidResponseMock);
            }
        });
    });
    describe("registerSupabase", () => {
        test("registerSupabase ha de retornar un json", async () => {
            const response = await Supaservice.registerSupabase({ email: "aaa", password: "bbb" });
            expect(response).toBeInstanceOf(Object);
            expect(response).toEqual(registerResponseMock);
        });
        // Falta testar l'error al registrar
    });
    describe("login", () => {
        afterEach(() => {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("expires_in");
            localStorage.removeItem("user");
            localStorage.removeItem("user_id");
        });
        test("login ha de guardar el token en localstorage", async () => {
            const response = await Supaservice.login({ email: "aaa", password: "bbb" });
            expect(localStorage.getItem("access_token")).toBe(response.access_token);
            expect(localStorage.getItem("refresh_token")).toBe(response.refresh_token);
            expect(localStorage.getItem("expires_in")).toBe("" + response.expires_in);
            expect(localStorage.getItem("user")).toBe(response.user.email);
            expect(localStorage.getItem("user_id")).toBe(response.user.id);
            expect(response).toEqual(loginResponseMock);
        });

    });
    describe("getData", () => {
        test("getData ha de retornar un json", async () => {
            const response = await Supaservice.getData("mockTable", { id: "1234" });
            expect(response).toBeInstanceOf(Object);
            expect(response).toEqual({
                id: "eq.1234", name: "aaa", "headers": {
                    "apikey": SUPABASE_KEY,
                    "authorization": `Bearer ${SUPABASE_KEY}`,
                    "content-type": "application/json",
                },
            });
        });
    });
  /*  describe("updateData", () => {
    });
    describe("updateProfile", () => {
    });
    describe("getImage", () => {
    });
    describe("getSession", () => {
    });*/
});



/*
describe("Supaservice tests integracio",()=>{

});*/