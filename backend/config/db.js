const mongoose=require("mongoose");

const connectDB=async()=>{
    try{
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            
        });
        console.log(`mongodb connected:${conn.connection.host}`);

    }catch(error){
        console.log(`error: ${error.message}`);
        process.exit();
    }
};

module.exports= connectDB;