import config from 'config';
import { authHeader } from '../_helpers';
import { toast } from 'react-toastify';

export const userService = {
    login,
    logout,
    register,
    getDataChart,
    getDevice,
    update,
    delete: _delete,
    toggleOnOff,
    createDevice,
    getNewestData
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email:username, password })
    };

    return fetch(`http://localhost:8000/api/login`, requestOptions)
        .then(handleResponse)
        .then(user => {
            // login successful if there's a jwt token in the response
            if (user.token) {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('user', JSON.stringify(user));
            }

            return user;
        });
}

function logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('user');
}

function getDataChart(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`http://localhost:8000/api/devices/${id}/data`, requestOptions).then(handleResponse);
}

function getDevice(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader()
    };

    return fetch(`http://localhost:8000/api/devices`, requestOptions).then(handleResponse);
}

function register(user) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`http://localhost:8000/api/register`, requestOptions).then(handleResponse);
}

function update(user) {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    return fetch(`${config.apiUrl}/users/${user.id}`, requestOptions).then(handleResponse);;
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader()
    };

    return fetch(`${config.apiUrl}/users/${id}`, requestOptions).then(handleResponse);
}
function toggleOnOff(device) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
        
    };
    console.log("\n\n\n\n\n\n\n\n\n\n\n\n",device)
    return fetch(`http://localhost:8000/api/devices/${device.id}/trigger`, requestOptions).then(handleResponse);
}

function createDevice(device) {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(device)
    };

    return fetch(`http://localhost:8000/api/devices`, requestOptions).then(handleResponse);
}

function getNewestData(id) {
    const requestOptions = {
        method: 'GET',
        headers: authHeader(),
    };

    return fetch(`http://localhost:8000/api/devices/${id}/newest-data`, requestOptions);
}

function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        // toast.success(
        //     <ServerResponseAlert
        //         title = "Send Data Success^^"
        //     />,
        //     { containerId: 'toast-notification' }
        // );
        if (!response.ok) {
            // toast.error(
            //     <ServerResponseAlert
            //         title="Send Data Failure!!"
            //     />,
            //     { containerId: 'toast-notification' }
            // );
            if (response.status === 401) {
                // auto logout if 401 response returned from api
                logout();
                location.reload(true);
            }

            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }

        return data;
    });
}