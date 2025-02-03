import i18next from "i18next";


const errorMessage = (err) => {
    return i18next.t([`errors.${err}`,'errors.1000']);
}

export default errorMessage

