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
const mongoose_1 = __importDefault(require("mongoose"));
const db_1 = require("./db");
const viem_1 = require("viem");
const chains_1 = require("viem/chains");
const sepoliaClient = (0, viem_1.createClient)({
    chain: chains_1.sepolia,
    transport: (0, viem_1.http)()
}).extend(viem_1.publicActions);
const apechainClient = (0, viem_1.createClient)({
    chain: chains_1.curtis,
    transport: (0, viem_1.http)()
}).extend(viem_1.publicActions);
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
        const latestBlock = yield sepoliaClient.getBlockNumber();
        console.log("LatestP", latestBlock);
        if (Number(latestBlock) === lastProcessedBlock)
            return;
        const block = yield sepoliaClient.getBlock({ blockNumber: latestBlock });
        //console.log("Transactions", block?.transactions, block?.length);
        console.log("bbb", block);
        console.log("bbb", block.transactions);
        const fullTransactions = yield Promise.all(block.transactions.map((txHash) => __awaiter(this, void 0, void 0, function* () {
            try {
                const txn = yield sepoliaClient.getTransaction({ hash: txHash });
                if (!txn || txn.value === undefined) {
                    console.warn(`Skipping invalid transaction: ${txHash}`);
                    return null;
                }
                return txn;
            }
            catch (error) {
                console.error(`Error fetching transaction ${txHash}:`, error);
                return null;
            }
        })));
        // Filter out null transactions
        const validTransactions = fullTransactions.filter(txn => txn !== null);
        console.log("Valid Transactions:", validTransactions);
        console.log("Full:", fullTransactions);
        const interested = yield fetchUsersDepositAddresses();
        console.log("Inside", interested);
        for (const txn of fullTransactions) {
            //@ts-ignore
            const InterestedTxns = txn.to && interested.includes(txn.to);
            if (InterestedTxns) {
                console.log("Eth Address :", txn === null || txn === void 0 ? void 0 : txn.to);
                console.log("Received amount :", txn === null || txn === void 0 ? void 0 : txn.value);
                //   setBalance("sepolia", txn?.to, txn?.value);
            }
        }
        //  await updatelastProcessedBlock("sepolia", Number(latestBlock));
    });
}
getETHTransfersFromBlock();
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connect("mongodb+srv://farman32740:f%40rman32740@cluster0.wvi5a.mongodb.net/ETH-Indexer");
    console.log("db connected");
    // setInterval(() => getETHTransfersFromBlock(), 5000);
    //  setInterval(() => getApeTransferFromBlock(), 1000);
});
main();
