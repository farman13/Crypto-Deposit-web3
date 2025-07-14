import { JsonRpcProvider, TransactionResponse, formatEther } from 'ethers';
import mongoose from 'mongoose';
import { blockModel, userModel } from './db';

const EthProvider = new JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/c0bpigJtL6UZwWMmIkZYpkeQXKXJ7G2w");
const ApeProvider = new JsonRpcProvider("https://apechain-curtis.g.alchemy.com/v2/QI_q9umXYDJqeAqM-dSGtKZS9_KjmO4Q");

const fetchUsersDepositAddresses = async () => {
    const users = await userModel.find();
    const InteresetedDepositAddresses = users.map(user => user.depositAddress);
    //  console.log(InteresetedDepositAddresses);
    return InteresetedDepositAddresses;
}

async function getLastProcessedBlock(chain: String) {
    const record = await blockModel.findOne({ chain });
    return record ? record.lastBlock : null;
}

async function updatelastProcessedBlock(chain: String, latestBlock: Number) {
    await blockModel.findOneAndUpdate({ chain },
        { lastBlock: latestBlock },
        { upsert: true, new: true }
    )
}

async function setBalance(chain: string, user: string | undefined, amount: bigint | undefined) {

    if (chain == "sepolia") {
        await userModel.findOneAndUpdate({ depositAddress: user },
            { ethBalance: amount }
        )
    }
    if (chain == "curtis") {
        await userModel.findOneAndUpdate({ depositAddress: user },
            { apeBalance: amount }
        )
    }
}

async function getETHTransfersFromBlock() {

    const lastProcessedBlock = await getLastProcessedBlock("sepolia") || 7743783;
    // console.log("LP", lastProcessedBlock);
    const latestBlock = await EthProvider.getBlockNumber();
    //  console.log("LatestP", latestBlock);

    if (latestBlock == lastProcessedBlock)
        return;

    const block = await EthProvider.getBlock(latestBlock);
    //console.log("Transactions", block?.transactions, block?.length);

    const fullTransactions = await Promise.all(
        //@ts-ignore
        block.transactions.map(txHash => EthProvider.getTransaction(txHash))
    );
    //  console.log("Full:", fullTransactions);
    const interested = await fetchUsersDepositAddresses();
    //  console.log("Inside", interested);

    for (const txn of fullTransactions) {
        //@ts-ignore
        const InterestedTxns = txn.to && interested.includes(txn.to);
        if (InterestedTxns) {
            console.log("Eth Address :", txn?.to);
            console.log("Received amount :", txn?.value)
            setBalance("sepolia", txn?.to, txn?.value);
        }
    }

    await updatelastProcessedBlock("sepolia", latestBlock);


}

const getApeTransferFromBlock = async () => {

    const lastProcessedBlock = await getLastProcessedBlock("curtis") || 16042546;
    const latestBlock = await ApeProvider.getBlockNumber();

    if (lastProcessedBlock == latestBlock)
        return;

    // console.log(latestBlock);
    const block = await ApeProvider.getBlock(latestBlock);
    // console.log("Ape Block txn", block?.transactions, block?.length);

    const fullTransaction = await Promise.all(
        //@ts-ignore
        block?.transactions?.map(txHash => ApeProvider.getTransaction(txHash))
    )

    // console.log(fullTransaction);

    const interestedAddresses = await fetchUsersDepositAddresses();

    for (const txn of fullTransaction) {
        //@ts-ignore
        const InterestedTxn = txn.to && interestedAddresses.includes(txn.to);
        if (InterestedTxn) {
            //@ts-ignore
            console.log("Curtis Address :", txn?.to);
            //@ts-ignore
            console.log("Received amount :", txn?.value)
            //@ts-ignore
            setBalance("curtis", txn?.to, txn?.value);
        }
    }

    await updatelastProcessedBlock("curtis", latestBlock);

}


const main = async () => {
    await mongoose.connect("mongodb+srv://farman32740:f%40rman4093274@cluster0.yd9ksor.mongodb.net//ETH-Indexer");
    console.log("db connected")
    setInterval(() => getETHTransfersFromBlock(), 5000);
    setInterval(() => getApeTransferFromBlock(), 1000);
}

main();