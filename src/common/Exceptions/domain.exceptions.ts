    import customErr from "./custom.error";

    export class badRequestException extends customErr{
        constructor(message:string = "Bad Request" , cause?:unknown){
            super(message , 400  , cause)
        }
    }
    export class unauthorizedException extends customErr{
        constructor(message:string = "Unauthorized" , cause?:unknown){
            super(message , 401  , cause)
        }
    }
    export class NotFoundException extends customErr{
        constructor(message:string = "Not Found" , cause?:unknown){
            super(message , 404  , cause)
        }
    }
    export class conflictException extends customErr{
        constructor(message:string = "Conflict" , cause?:unknown){
            super(message , 409  , cause)
        }
    }