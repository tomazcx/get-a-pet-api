import mongoose from "../db/conn.js";
import { Schema } from "mongoose";

const User = mongoose.model("User", new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        image: {
            type: String
        },
        phone: {
            type: String,
            required: true
        }
    }, { timestamps: true } //fornece informações de tempo de createdAt e updatedAt
))

export default User