export interface CustomHttpResponse {
     timeStamp: Date,
     httpStatusCode: number; // 200, 201, 400, 500
     HttpStatus: string;
     reason: string;
    message: string;
}