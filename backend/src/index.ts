import express from "express";
import authRoutes from "./auth/authRoutes"
import cors from "cors"

const app = express();
app.use(cors())
app.use(express.json());
app.use("/auth", authRoutes)

app.get("/", async (req, res) => {
  res.json({ message: "Hello, World!" });
}
);
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
}
);
export default app;