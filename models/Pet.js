import mongoose from "../db/conn.js";
import { Schema } from "mongoose";

const Pet = mongoose.model("Pet", new Schema({
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        weight: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        images: {
            type: Array,
            required: true
        },
        available: {
            type: Boolean
        },
        owner: Object,
        adopter: Object
    }, { timestamps: true } //fornece informações de tempo de createdAt e updatedAt
))

export default Pet