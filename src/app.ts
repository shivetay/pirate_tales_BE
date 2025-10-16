import express from "express";
import morgan from "morgan";
import { userRoutes } from "./routes";

const app = express();

if (process.env.NODE_ENV === "development") {
	console.log("Development mode");
	app.use(morgan("dev"));
}

app.use("/api/v1/", userRoutes);

export default app;
