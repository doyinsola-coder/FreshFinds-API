import express from "express";
import cors from "cors";

const setupMiddlewares = (app) => {
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    }

    export default setupMiddlewares;