// @ts-nocheck
import express, { NextFunction, Request, Response } from "express";
import config from "src/config";

const app = express();

console.log(config);
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello World!");
});

app.listen(config.port, config.host, () => {
  console.log(`
  ################################################
  ##              Server is running             ##
  ################################################
  `);
});
