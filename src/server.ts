import dotenv from "dotenv";
import app from "./app";

// Load environment variables based on NODE_ENV
const envFile =
	process.env.NODE_ENV === "production" ? "./prod.env" : "./dev.env";
dotenv.config({ path: envFile });

const PORT = process.env.PORT || 3003;

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
