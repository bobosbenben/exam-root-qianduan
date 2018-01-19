import store from '../store'
require('isomorphic-fetch');

// These are "fake network" function that in a real scenario would
// call the backend API and upon return would update your redux state.
// We're just going to skip to the redux part and add a setTimeout
// for some fake latency

export const getLoggedUser = () => {
    store.dispatch({
        type: 'GET_LOGGED_USER'
    });

    let url = '/sys/login';

    fetch(url, {
        credentials: 'include',
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
        .then(res=>res.json())
        .then(json=>{
            let loggedIn = json.data.loggedIn;
            store.dispatch({
                type: 'SET_LOGGED_USER',
                logged: loggedIn
            });
        });
}

export const login = (username,password) => {
    return new Promise((resolve, reject) => {

        let searchParams = new URLSearchParams();
        searchParams.set('username',username);
        searchParams.set('password',password);
        let url = '/sys/login';

        store.dispatch({
            type: 'GET_LOGGED_USER'
        });
        fetch(url, {
            credentials: 'include',
            method: 'POST',
            body: searchParams
        })
            .then(res=>res.json())
            .then(json=>{
                let loggedIn = json.data.loggedIn;
                store.dispatch({
                    type: 'SET_LOGGED_USER',
                    logged: loggedIn
                });
                resolve({
                    logged:loggedIn
                });
            })
    })
}
