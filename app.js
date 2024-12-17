import dotenv from "dotenv";
dotenv.config();

import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import cors from "cors";
import expressLayouts from "express-ejs-layouts";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));

// Get the directory of the current file (app.js)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(flash());
app.use(cors({
    origin: "http://localhost:3000"
}));

app.use((req, res, next) => {
    res.locals.successMessage = req.flash("success");
    res.locals.errorMessage = req.flash("error");
    next();
});

import indexRoutes from "./routes/indexRoutes.js";
app.use("/", indexRoutes);

app.use((req, res, next) => {
    const locals = { title: "404 | Page Not Found!" };
    return res.status(404).render("404", {
        locals,
        layout: "layouts/errorLayout",
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    const locals = { title: "500 | Internal Server Error!" };
    return res.status(500).render("internalError", {
        locals,
        layout: "layouts/errorLayout",
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});