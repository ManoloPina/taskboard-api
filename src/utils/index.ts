import { Request, Response } from "express";

// interface CleanRequestBody {
//   [key:string]: typeof []
// }

export default class Utils {
  static handleCatchRequest(
    _req: Request<any, any, any>,
    res: Response,
    error: any
  ) {
    console.error(error);

    // Handle specific Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(422).json({
        error: "Validation Error",
        details: (error as any).errors,
      });
    }

    return res.status(500).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }

  static cleanRequestBody<B>(body: B, fieldName?: string) {
    const obj: Partial<B> = {};
    Object.keys(body as [keyof B]).forEach((key: string) => {
      if (!fieldName) {
        obj[key as keyof B] = body[key as keyof B];
      } else {
        obj[`${fieldName}.$.${key}` as keyof B] = body[key as keyof B];
      }
    });
    return obj;
  }
}
