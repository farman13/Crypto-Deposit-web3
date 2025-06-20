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
const ethers_1 = require("ethers");
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./db");
const EthProvider = new ethers_1.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/c0bpigJtL6UZwWMmIkZYpkeQXKXJ7G2w");
const ApeProvider = new ethers_1.JsonRpcProvider("https://apechain-curtis.g.alchemy.com/v2/QI_q9umXYDJqeAqM-dSGtKZS9_KjmO4Q");
const fetchUsersDepositAddresses = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.userModel.find();
    const InteresetedDepositAddresses = users.map(user => user.depositAddress);
    //  console.log(InteresetedDepositAddresses);
    return InteresetedDepositAddresses;
});
function getLastProcessedBlock(chain) {
    return __awaiter(this, void 0, void 0, function* () {
        const record = yield db_1.blockModel.findOne({ chain });
        return record ? record.lastBlock : null;
    });
}
function updatelastProcessedBlock(chain, latestBlock) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.blockModel.findOneAndUpdate({ chain }, { lastBlock: latestBlock }, { upsert: true, new: true });
    });
}
function setBalance(chain, user, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        if (chain == "sepolia") {
            yield db_1.userModel.findOneAndUpdate({ depositAddress: user }, { ethBalance: amount });
        }
        if (chain == "curtis") {
            yield db_1.userModel.findOneAndUpdate({ depositAddress: user }, { apeBalance: amount });
        }
    });
}
function getETHTransfersFromBlock() {
    return __awaiter(this, void 0, void 0, function* () {
        const lastProcessedBlock = (yield getLastProcessedBlock("sepolia")) || 7743783;
        // console.log("LP", lastProcessedBlock);
        const latestBlock = yield EthProvider.getBlockNumber();
        //  console.log("LatestP", latestBlock);
        if (latestBlock == lastProcessedBlock)
            return;
        const block = yield EthProvider.getBlock(latestBlock);
        //console.log("Transactions", block?.transactions, block?.length);
        const fullTransactions = yield Promise.all(
        //@ts-ignore
        block.transactions.map(txHash => EthProvider.getTransaction(txHash)));
        //  console.log("Full:", fullTransactions);
        const interested = yield fetchUsersDepositAddresses();
        //  console.log("Inside", interested);
        for (const txn of fullTransactions) {
            //@ts-ignore
            const InterestedTxns = txn.to && interested.includes(txn.to);
            if (InterestedTxns) {
                console.log("Eth Address :", txn === null || txn === void 0 ? void 0 : txn.to);
                console.log("Received amount :", txn === null || txn === void 0 ? void 0 : txn.value);
                setBalance("sepolia", txn === null || txn === void 0 ? void 0 : txn.to, txn === null || txn === void 0 ? void 0 : txn.value);
            }
        }
        yield updatelastProcessedBlock("sepolia", latestBlock);
    });
}
const getApeTransferFromBlock = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const lastProcessedBlock = (yield getLastProcessedBlock("curtis")) || 16042546;
    const latestBlock = yield ApeProvider.getBlockNumber();
    if (lastProcessedBlock == latestBlock)
        return;
    // console.log(latestBlock);
    const block = yield ApeProvider.getBlock(latestBlock);
    // console.log("Ape Block txn", block?.transactions, block?.length);
    const fullTransaction = yield Promise.all(
    //@ts-ignore
    (_a = block === null || block === void 0 ? void 0 : block.transactions) === null || _a === void 0 ? void 0 : _a.map(txHash => ApeProvider.getTransaction(txHash)));
    // console.log(fullTransaction);
    const interestedAddresses = yield fetchUsersDepositAddresses();
    for (const txn of fullTransaction) {
        //@ts-ignore
        const InterestedTxn = txn.to && interestedAddresses.includes(txn.to);
        if (InterestedTxn) {
            //@ts-ignore
            console.log("Curtis Address :", txn === null || txn === void 0 ? void 0 : txn.to);
            //@ts-ignore
            console.log("Received amount :", txn === null || txn === void 0 ? void 0 : txn.value);
            //@ts-ignore
            setBalance("curtis", txn === null || txn === void 0 ? void 0 : txn.to, txn === null || txn === void 0 ? void 0 : txn.value);
        }
    }
    yield updatelastProcessedBlock("curtis", latestBlock);
});
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb+srv://farman32740:f%40rman32740@cluster0.wvi5a.mongodb.net/ETH-Indexer");
    console.log("db connected");
    setInterval(() => getETHTransfersFromBlock(), 5000);
    setInterval(() => getApeTransferFromBlock(), 1000);
});
main();
