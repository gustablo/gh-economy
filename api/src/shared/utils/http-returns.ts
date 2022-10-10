import { HttpResponse } from "../contracts/http-response";

export const commonError = (err: Error): HttpResponse => {
    return {
        status: 500,
        message: err.message,
    }
}

export const commonSuccess = (message: any): HttpResponse => {
    return {
        status: 200,
        message,
    }
}