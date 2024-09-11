import mongoose from "mongoose"

const connectdb = async() =>{
    try{
        if(mongoose.connection.readyState === 0){
            await mongoose.connect(process.env.MONGODB_URI)
            console.log("database connetced")
        }
        console.log("database reconnetced")
    }catch(error){
        console.log(error)
    }
}

export default connectdb