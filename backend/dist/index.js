"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ethers_1 = require("ethers");
const bip39_1 = require("bip39");
const config_1 = require("./config");
const db_js_1 = require("./db.js");
const mongoose_1 = __importDefault(require("mongoose"));
const cors = require('cors');
const seed = (0, bip39_1.mnemonicToSeedSync)(config_1.MNEMONIC);
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cors());
let userId = 1;
app.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    const user = yield db_js_1.userModel.create({
        userId,
        username,
        password
    });
    console.log(user);
    const userID = user.userId;
    console.log(userID);
    const derivationPath = `m/44'/60'/${userID}'/0'`;
    const hdNode = ethers_1.HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);
    yield db_js_1.userModel.findOneAndUpdate({ userId: userID }, {
        depositAddress: child.address,
        privateKey: child.privateKey,
        ethBalance: 0,
        apeBalance: 0
    });
    res.json({
        userId: userID
    });
    userId++;
}));
app.get("/depositAddress/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userID = req.params.userId;
    const user = yield db_js_1.userModel.findOne({
        userId: userID
    });
    if (!user) {
        res.json({
            message: "user not exist , please signup!"
        });
        return;
    }
    res.json({
        depositAddress: user.depositAddress
    });
}));
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb+srv://farman32740:f%40rman4093274@cluster0.yd9ksor.mongodb.net//ETH-Indexer");
    console.log("Db connected");
    app.listen(3000);
});
main();
