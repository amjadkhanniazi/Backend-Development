import dotenv from 'dotenv';
dotenv.config();

export default {
    MongoUrl: `mongodb+srv://amjad:${process.env.db_password}@mongotest.rqx1a.mongodb.net/ReFruits`,
    options:{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
}