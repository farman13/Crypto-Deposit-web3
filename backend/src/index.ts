import express from 'express';
import { HDNodeWallet, Wallet } from 'ethers';
import { mnemonicToSeedSync } from 'bip39';
import { MNEMONIC } from './config';
import { userModel } from './db.js'
import mongoose from 'mongoose';
const cors = require('cors');

const seed = mnemonicToSeedSync(MNEMONIC);

const app = express();
app.use(express.json());
app.use(cors());

let userId = 1;

app.post("/signup", async (req, res) => {

    const username = req.body.username;
    const password = req.body.password;

    const user = await userModel.create({
        userId,
        username,
        password
    })
    console.log(user);
    const userID = user.userId
    console.log(userID);
    const derivationPath = `m/44'/60'/${userID}'/0'`;
    const hdNode = HDNodeWallet.fromSeed(seed);
    const child = hdNode.derivePath(derivationPath);

    await userModel.findOneAndUpdate(
        { userId: userID },
        {
            depositAddress: child.address,
            privateKey: child.privateKey,
            ethBalance: 0,
            apeBalance: 0
        })

    res.json({
        userId: userID
    })
    userId++;


})

app.get("/depositAddress/:userId", async (req, res) => {

    const userID = req.params.userId;

    const user = await userModel.findOne({
        userId: userID
    })

    if (!user) {
        res.json({
            message: "user not exist , please signup!"
        })
        return;
    }
    res.json({
        depositAddress: user.depositAddress
    })

})


const main = async () => {
    await mongoose.connect("mongodb+srv://farman32740:f%40rman32740@cluster0.wvi5a.mongodb.net/ETH-Indexer");
    console.log("Db connected")
    app.listen(3000);
}

main();