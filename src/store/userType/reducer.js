import { USERTYPE_SET, USERTYPE_RESET } from "./constants"

const INITIAL_STATE = {
    userTypes: ""
}

export default (state = INITIAL_STATE, { type, payload }) => {
    switch (type) {
        case USERTYPE_SET:
            return {
                ...state,
                userTypes: payload
            }

        case USERTYPE_RESET:
            return {
                ...state,
                userTypes: ""
            }
            default: 
            return state;
    }

}