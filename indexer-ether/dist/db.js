"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blockModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const userSchema = new Schema({
    userId: Number,
    username: String,
    password: String,
    depositAddress: String,
    privateKey: String,
    ethBalance: String,
    apeBalance: String
});
const blockSchema = new Schema({
    chain: String,
    lastBlock: Number
});
exports.userModel = mongoose_1.default.model("users", userSchema);
exports.blockModel = mongoose_1.default.model("blocks", blockSchema);
