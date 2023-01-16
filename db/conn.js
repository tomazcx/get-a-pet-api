import mongoose from "mongoose";

const main = async() => {
    try {
        await mongoose.connect(process.env.API_MONGO_URL)
        console.log("Connected.")
    } catch (e) {
        console.log("Connection error.")
    }
}

main()

export default mongoose