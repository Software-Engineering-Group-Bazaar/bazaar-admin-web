const server = import.meta.env.VITE_API_URL;


export const api = {
    login: `${server}/api/Auth/login`,
    users: `${server}/api/Admin/users`,
    delete_user: `${server}/api/Admin/user/`,
    create_user: `${server}/api/Admin/users/create`,
    approve_user: `${server}/api/Admin/users/approve`
}