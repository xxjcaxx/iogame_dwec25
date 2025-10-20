import { SUPABASE_KEY, SUPABASE_URL } from "../env";
export { loginSupabase, registerSupabase, login, register };
/*
env.js: 

export  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd25mYmhuZW1laGl4aGl1cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzIxMzgsImV4cCI6MjA3NjEwODEzOH0.3cNnBxWPVvpfr0vcFvbr2fxz2y20ZW2GNS6IZS6pHK0";

export const SUPABASE_URL = 'https://zjwnfbhnemehixhiupey.supabase.co';
       
*/

const headerFactory = ({  // Parameter destructuring amb valors per defecte
    apikey = SUPABASE_KEY,
    Authorization = `Bearer ${SUPABASE_KEY}`,
    contentType = "application/json"
} = {}) => {
    const headers = new Headers();
    apikey && headers.append("apikey", apikey);
    Authorization && headers.append("Authorization", Authorization);
    contentType && headers.append("Content-Type", contentType);
    return headers;
}

const fetchSupabase = async (url, options) => {
    try {
        const response = await fetch(url, options)
        if (response.ok) {
            const data = await response.json();
            return data;

        }
        else {
            const error = await response.json();
            throw error;
        }

    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

const loginSupabase = (dataLogin) => {
    return fetchSupabase(
        `${SUPABASE_URL}/auth/v1/token?grant_type=password`,
        {
            method: "post",
            headers: headerFactory({Authorization:null}),
            body: JSON.stringify(dataLogin)
        })
}

const registerSupabase = (dataRegister) => {
    return fetchSupabase(
        `${SUPABASE_URL}/auth/v1/signup`,
        {
            method: "POST",
            headers: headerFactory({Authorization:null}),
            body: JSON.stringify(dataRegister)
        }
    );
}


const login = async (dataLogin)=>{
    const loginResponse = await loginSupabase(dataLogin);
    localStorage.setItem('access_token',loginResponse.access_token);
    localStorage.setItem('refresh_token',loginResponse.refresh_token);
    localStorage.setItem('expires_in',loginResponse.expires_in);
    localStorage.setItem('user',loginResponse.user.email);
    return loginResponse;
}

const register = async (dataRegister)=>{
    const registerResponse = await registerSupabase(dataRegister);
}