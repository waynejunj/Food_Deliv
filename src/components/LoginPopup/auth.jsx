import axios from "axios";

export class Auth {
    static async signup(data) {
        const response = await axios.post(
            "https://ivoryladdle.pythonanywhere.com/api/signup",
            data
        );
        return response;
    }

    static async signin(data) {
        const response = await axios.post(
            "https://ivoryladdle.pythonanywhere.com/api/signin",
            data
        );
        return response;
    }
}