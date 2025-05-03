import mongoose from "mongoose";

const mongooseConnect = async () => {
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.MONGO_DB}`);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default mongooseConnect;