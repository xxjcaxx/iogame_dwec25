import { SUPABASE_KEY, SUPABASE_URL } from "../env";
export { loginSupabase, registerSupabase, login, 
    register, getData, updateData, updateProfile,
    getImage, getSession, saveData
 };
/*
env.js: 

export  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpqd25mYmhuZW1laGl4aGl1cGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1MzIxMzgsImV4cCI6MjA3NjEwODEzOH0.3cNnBxWPVvpfr0vcFvbr2fxz2y20ZW2GNS6IZS6pHK0";

export const SUPABASE_URL = 'https://zjwnfbhnemehixhiupey.supabase.co';
       
*/

const getBearer = () => {
    let bearer = localStorage.getItem('access_token');
    bearer = bearer ? `Bearer ${bearer}` : `Bearer ${SUPABASE_KEY}`;
    return bearer;
}

const headerFactory = ({  // Parameter destructuring amb valors per defecte
    apikey = SUPABASE_KEY,
    Authorization = getBearer(),
    contentType = "application/json",
    Prefer = null
} = {}) => {
    const headers = new Headers();
    apikey && headers.append("apikey", apikey);
    Authorization && headers.append("Authorization", Authorization);
    contentType && headers.append("Content-Type", contentType);
    Prefer && headers.append("Prefer", Prefer)
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
            headers: headerFactory({ Authorization: null }),
            body: JSON.stringify(dataLogin)
        })
}

const registerSupabase = (dataRegister) => {
    return fetchSupabase(
        `${SUPABASE_URL}/auth/v1/signup`,
        {
            method: "POST",
            headers: headerFactory({ Authorization: null }),
            body: JSON.stringify(dataRegister)
        }
    );
}


const login = async (dataLogin) => {
    const loginResponse = await loginSupabase(dataLogin);
    localStorage.setItem('access_token', loginResponse.access_token);
    localStorage.setItem('refresh_token', loginResponse.refresh_token);
    localStorage.setItem('expires_in', loginResponse.expires_in);
    localStorage.setItem('user', loginResponse.user.email);
    localStorage.setItem('user_id', loginResponse.user.id);
    return loginResponse;
}

const getSession = ()=>{
    return localStorage.getItem('user_id');
}

const register = async (dataRegister) => {
    const registerResponse = await registerSupabase(dataRegister);
    return registerResponse;
}

const getData = async (table, query) => {
    const supaquery = `&id=eq.${query.id}`
    const data = await fetchSupabase(`${SUPABASE_URL}/rest/v1/${table}?select=*${supaquery}`, {
        method: "get",
        headers: headerFactory({}),
    });
    return data;
}

const updateData = async (table, id, data) => {
    console.log(table, id, data);

    const result = await fetchSupabase(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
        method: "PATCH",
        headers: headerFactory({ Prefer: "return=representation" }),
        body: JSON.stringify(data)
    });
    return result;
}

const updateProfile = async (id, data) => {
    const avatarFile = data.avatar;
    let formImg = new FormData();
    formImg.append("avatar", avatarFile, avatarFile.name);
    const headers = headerFactory({ contentType: null });
    headers.append("x-upsert", true);
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/avatars/${avatarFile.name}`, {
        method: 'POST',
        headers: headers,
        body: formImg
    });
    const avatarInfo = await response.json();
    data.avatar_url = avatarInfo.Key;
    delete data.avatar;
    updateData('profiles', id, data)
}

const getImage = async (fileUrl) => {
    const response = await fetch(`${SUPABASE_URL}/storage/v1/object/${fileUrl}`, {
        method: 'GET',
        headers: headerFactory({ contentType: null })
    });
    if (response.status >= 200 && response.status <= 300) {
        if (response.headers.get("content-type")) {
            let datos = await response.blob();
            const urlImage =  URL.createObjectURL(datos);
            return urlImage;
        }
        return null;
    }
}

const saveData = async (table, data) => {
    const result = await fetchSupabase(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: "PATCH",
        headers: headerFactory({ Prefer: "return=representation" }),
        body: JSON.stringify(data)
    });
    return result;
}
