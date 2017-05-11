import { eventChannel, buffers } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'
import { dict } from '../actions'

import { config, _handleRPC } from './handler'


const {GET_SETTINGS_RPC, SET_SYSTEM_INFO, SET_PERFORMANCE_CHARTS, SET_CHOSEN_HARDWARE_PRESET, SET_PROV_MIN_PRICE, SET_REQ_MAX_PRICE, SET_NODE_NAME} = dict


export function callSettings(session) {
    return new Promise((response, reject) => {
        let actionList = []
        function on_settings(args) {
            let on_settings = args[0];
            console.log("SETTINGS", on_settings)
            const {num_cores, max_memory_size, max_resource_size, estimated_performance, estimated_lux_performance, estimated_blender_performance, hardware_preset_name, min_price, max_price, node_name} = on_settings

            actionList.push({
                type: SET_SYSTEM_INFO,
                payload: {
                    num_cores,
                    max_memory_size,
                    max_resource_size
                }
            })

            actionList.push({
                type: SET_PERFORMANCE_CHARTS,
                payload: {
                    estimated_performance,
                    estimated_lux_performance,
                    estimated_blender_performance
                }
            })

            actionList.push({
                type: SET_CHOSEN_HARDWARE_PRESET,
                payload: hardware_preset_name
            })

            actionList.push({
                type: SET_PROV_MIN_PRICE,
                payload: min_price
            })

            actionList.push({
                type: SET_REQ_MAX_PRICE,
                payload: max_price
            })

            actionList.push({
                type: SET_NODE_NAME,
                payload: node_name
            })

            response(actionList)
        }

        _handleRPC(on_settings, session, config.GET_SETTINGS_RPC)
    })
}

export function* settingsFlow(session) {
    const actionList = yield call(callSettings, session)
    console.log("SETTINGS_ACTION", actionList)
    yield actionList && actionList.map((item) => {
        return put(item)
    })
}