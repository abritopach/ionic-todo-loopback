export class Environment {

    private url: String;
    private port: Number;
    private absoluteURL: String


    constructor(type: string) {
        switch (type)
        {
            case'LOCALHOST':
                this.url = "http://localhost";
                this.port = 3000;
                this.absoluteURL = this.url + ':' + this.port.toString() + '/';
                break;
            case'HEROKU':
                this.url = "https://todo-loopback.herokuapp.com/";
                this.port = null;
                this.absoluteURL = this.url;
                break;
            default:
                this.url = "http://localhost";
                this.port = 3000;
                this.absoluteURL = this.url + ':' + this.port.toString();
        }

    }

    getURL() : String {
        return this.absoluteURL;
    }

}