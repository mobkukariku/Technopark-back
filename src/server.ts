import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import {connectToDB} from "./lib/db";
import cookieParser from "cookie-parser";
import authRoute from "./routes/auth.route";
import profileRoute from "./routes/profile.route";
import newsRoute from "./routes/news.route";
import joinRequestRoute from "./routes/joinRequest.route";
import projectRoute from "./routes/project.route";
import memberRoute from "./routes/member.route";
import departmentRoute from "./routes/department.route";

dotenv.config();

const PORT = process.env.PORT;

const app = express();

app.use(cors({
    origin: process.env.FRONT_IP,
    credentials: true,
}));
app.use(bodyParser.json());
app.use(cookieParser());



const apiRouter = express.Router();
apiRouter.use("/auth", authRoute);
apiRouter.use("/profile", profileRoute);
apiRouter.use("/news", newsRoute);
apiRouter.use("/requests", joinRequestRoute);
apiRouter.use("/projects", projectRoute);
apiRouter.use("/members", memberRoute);
apiRouter.use("/departments", departmentRoute);

app.use("/api", apiRouter);

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
    await connectToDB();
});