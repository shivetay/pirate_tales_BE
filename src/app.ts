import express from "express";
import morgan from "morgan";
import { userRoutes } from "./routes";

const app = express();

// Body parsing middleware
app.use(express.json());

if (process.env.NODE_ENV === "development") {
	// biome-ignore lint/suspicious/noConsole: console log for development mode
	console.log("Development mode");
	app.use(morgan("dev"));
}

app.use("/api/v1/users", userRoutes);

export default app;
