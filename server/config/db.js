import mongoose from "mongoose";

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Db Conected!');
    } catch (error) {
        console.log('MongoDb Error :' + error.message);
        process.exit(1) // code exits with one failure
    }
}

export default connectDb;