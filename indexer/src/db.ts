import mongoose from "mongoose";
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userId: Number,
    username: String,
    password: String,
    depositAddress: String,
    privateKey: String,
    ethBalance: String,
    apeBalance: String

})

const blockSchema = new Schema({
    chain: String,
    lastBlock: Number
})

export const userModel = mongoose.model("users", userSchema);
export const blockModel = mongoose.model("blocks", blockSchema);
