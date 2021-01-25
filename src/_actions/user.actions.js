import { userConstants } from '../_constants';
import { userService } from '../_services';
import { alertActions } from './';
import { history } from '../_helpers';

export const userActions = {
    login,
    logout,
    register,
    getDataChart,
    delete: _delete,
    getAllDevice,
    sendDataOnOff,
    createDevice
};

function login(username, password) {
    return dispatch => {
        dispatch(request({ username }));

        userService.login(username, password)
            .then(
                user => { 
                    dispatch(success(user));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.LOGIN_REQUEST, user } }
    function success(user) { return { type: userConstants.LOGIN_SUCCESS, user } }
    function failure(error) { return { type: userConstants.LOGIN_FAILURE, error } }
}

function logout() {
    userService.logout();
    return { type: userConstants.LOGOUT };
}

function register(user) {
    return dispatch => {
        dispatch(request(user));

        userService.register(user)
            .then(
                user => { 
                    dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) { return { type: userConstants.REGISTER_FAILURE, error } }
}

function getDataChart(id) {
    return dispatch => {
        dispatch(request());

        userService.getDataChart(id)
            .then(
                users => dispatch(success(users)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GETALL_REQUEST } }
    function success(users) { return { type: userConstants.GETALL_SUCCESS, users } }
    function failure(error) { return { type: userConstants.GETALL_FAILURE, error } }
}

// prefixed function name with underscore because delete is a reserved word in javascript
function _delete(id) {
    return dispatch => {
        dispatch(request(id));

        userService.delete(id)
            .then(
                user => dispatch(success(id)),
                error => dispatch(failure(id, error.toString()))
            );
    };

    function request(id) { return { type: userConstants.DELETE_REQUEST, id } }
    function success(id) { return { type: userConstants.DELETE_SUCCESS, id } }
    function failure(id, error) { return { type: userConstants.DELETE_FAILURE, id, error } }
}

function getAllDevice() {
    return dispatch => {
        dispatch(request());

        userService.getDevice()
            .then(
                devices => dispatch(success(devices)),
                error => dispatch(failure(error.toString()))
            );
    };

    function request() { return { type: userConstants.GET_DEVICE_REQUEST } }
    function success(devices) { return { type: userConstants.GET_DEVICE_SUCCESS, devices } }
    function failure(error) { return { type: userConstants.GET_DEVICE_FAILURE, error } }
}

function sendDataOnOff(device) {
    return dispatch => {
        dispatch(request(device));

        userService.toggleOnOff(device)
            .then(
                device => { 
                    dispatch(success(device));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(device) { return { type: userConstants.PUT_DATA_DEVICE_REQUEST, device } }
    function success(device) { return { type: userConstants.PUT_DATA_DEVICE_SUCCESS, device } }
    function failure(error) { return { type: userConstants.PUT_DATA_DEVICE_FAILURE, error } }
}

function createDevice(device) {
    return dispatch => {
        dispatch(request(device));

        userService.createDevice(device)
            .then(
                device => { 
                    dispatch(success(device));
                    history.push('/');
                },
                error => {
                    dispatch(failure(error.toString()));
                    dispatch(alertActions.error(error.toString()));
                }
            );
    };

    function request(device) { return { type: userConstants.POST_DATA_DEVICE_REQUEST, device } }
    function success(device) { return { type: userConstants.POST_DATA_DEVICE_SUCCESS, device } }
    function failure(error) { return { type: userConstants.POST_DATA_DEVICE_FAILURE, error } }
}