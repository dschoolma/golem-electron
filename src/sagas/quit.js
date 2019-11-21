import { fork, takeLatest, take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'

const {APP_QUIT, APP_QUIT_GRACEFUL, SET_GRACEFUL_QUIT} = dict

export function gracefulShutdown(session) {
    return new Promise((resolve, reject) => {
        function on_app(args) {
            let appStatus = args[0];
            //App status
            // 0 immediate quit
            // 1 off & shutdown cancelled
            // 2 shutdown scheduled
            resolve({
                type: SET_GRACEFUL_QUIT,
                payload: appStatus > 1
            });
        }

        _handleRPC(on_app, session, config.QUIT_GRACEFUL_RPC)
    });
}

/**
 * [*terminateGolemBase generator terminate golem core]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* gracefulShutdownBase(session) {
    const action = yield call(gracefulShutdown, session);
    yield put(action);
}

export function terminateGolem(session, cb) {
        function on_app(args) {
            let appStatus = args[0];
            cb(appStatus)
        }

        _handleRPC(on_app, session, config.QUIT_RPC)
}

/**
 * [*terminateGolemBase generator terminate golem core]
 * @param {[type]} session       [Session of the wamp connection]
 */
export function* terminateGolemBase(session, {_cb}) {
    yield call(terminateGolem, session, _cb);
}

/**
 * [*quitFlow generator]
 * @param  {Object} session     [Websocket connection session]
 * @yield   {Object}            [Action object]
 */
export function* quitFlow(session) {
    yield takeLatest(APP_QUIT, terminateGolemBase, session)
    yield takeLatest(APP_QUIT_GRACEFUL, gracefulShutdownBase, session)
}