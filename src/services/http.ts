import { Response } from "express";
import { IRes } from "../types";
import { TypeResult } from "../types/http";

class HttpService {
  constructor() {}

  handleCatchResponse(res: Response<IRes<any>>, error: any) {
    console.error(error);

    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(422).json({
        content: null,
        typeResult: TypeResult.Error,
        message: (error as any).errors,
      });
    }

    return res.status(500).json({
      content: null,
      typeResult: TypeResult.Error,
      message: `Internal Server Error: ${error.message}`,
    });
  }
}

export default HttpService;
