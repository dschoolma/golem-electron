import { dict } from './../actions'
const {remote} = window.electron;
const mainProcess = remote.require('./index')
const {setConfig, getConfig, dictConfig, configStore} = remote.getGlobal('configStorage')


const { 
    SET_GOLEM_VERSION, 
    SET_LATEST_VERSION, 
    UPDATE_SEEN, 
    SET_NETWORK_INFO, 
    IS_NODE_PROVIDER,
    SET_FILE_CHECK, 
    SET_CONNECTION,
    SET_CONNECTION_PROBLEM, 
    SET_GOLEM_PAUSE_STATUS,
    SET_TERMS_STATUS,
    SET_TERMS,
    SET_CHAIN_INFO
} = dict

const {GOLEM_STARTER, HIDE_ONBOARD} = dictConfig

const initialState = {
    version: {
        number: "",
        message: "Connection is not established yet.",
        error: false
    },
    latestVersion: {
        number: "",
        issue: null,
        importance: null,
        seen: false
    },
    isMainNet: remote.process.argv.includes('--mainnet'),
    networkInfo: {},
    fileCheckModal: {
        status: false,
        files: []
    },
    connectionProblem: {
        status: false,
        issue: null
    },
    isConnected: false,
    isEngineOn: (getConfig(GOLEM_STARTER) === null || getConfig(GOLEM_STARTER) === undefined) ? true : getConfig(GOLEM_STARTER),
    terms: "",
    isTermsAccepted: false,
    isNodeProvider: true
}

function isNewVersion(_old, _new){
    let result = mainProcess.checkUpdate(_old, _new)
    return result
}
//console.log(getConfig(GOLEM_STARTER))
const setInfo = (state = initialState, action) => {
    switch (action.type) {
    case SET_GOLEM_VERSION:
        return Object.assign({}, state, {
            version: {
                ...action.payload
            }
        });

    case SET_LATEST_VERSION:
        const importance = isNewVersion(action.payload, state.version.number)
        return Object.assign({}, state, {
            latestVersion: {
                ...state.latestVersion,
                number: action.payload,
                importance,
                issue: (!!importance && !state.latestVersion.seen) ? "UPDATE" : null
            }
        });

    case SET_NETWORK_INFO:
        setConfig(GOLEM_STARTER, true)
        return Object.assign({}, state, {
            networkInfo: action.payload,
            isEngineOn: true
        });

    case SET_FILE_CHECK: {
            const {status, files} = action.payload
            return Object.assign({}, state, {
                fileCheckModal: {
                    status,
                    files: files || []
                }
            });}

    case SET_CONNECTION_PROBLEM: {
            const {status, issue} = action.payload
            return Object.assign({}, state, {
                connectionProblem: {
                    ...state.connectionProblem,
                    ...action.payload
                }
            });}

    case SET_GOLEM_PAUSE_STATUS:
        setConfig(GOLEM_STARTER, action.payload)
        return Object.assign({}, state, {
            isEngineOn: action.payload
        });

    case UPDATE_SEEN:
        return Object.assign({}, state, {
            latestVersion: {
                ...state.latestVersion,
                issue: null,
                seen: true
            }
        });
        
    case SET_TERMS_STATUS:
        return Object.assign({}, state, {
            isTermsAccepted: action.payload
        });

    case SET_TERMS:
        return Object.assign({}, state, {
            terms: action.payload
        });

    case SET_CHAIN_INFO:
        return Object.assign({}, state, {
            isMainNet: action.payload,
            isConnected: true
        });

    case SET_CONNECTION:
        return Object.assign({}, state, {
            isConnected: action.payload
        })

    case IS_NODE_PROVIDER:
        return Object.assign({}, state, {
            isNodeProvider: action.payload
        })

    default:
        return state;
    }
}

export default setInfo