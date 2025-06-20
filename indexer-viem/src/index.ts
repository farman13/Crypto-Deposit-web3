import mongoose from 'mongoose';
import { blockModel, userModel } from './db';
import { createClient, http, publicActions } from 'viem';
import { sepolia, curtis } from 'viem/chains'

const sepoliaClient = createClient({
    chain: sepolia,
    transport: http()
}).extend(publicActions)

const apechainClient = createClient({
    chain: curtis,
    transport: http()
}).extend(publicActions)

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
    const latestBlock = await sepoliaClient.getBlockNumber();
    console.log("LatestP", latestBlock);

    if (Number(latestBlock) === lastProcessedBlock)
        return;

    const block = await sepoliaClient.getBlock({ blockNumber: latestBlock });
    //console.log("Transactions", block?.transactions, block?.length);
    console.log("bbb", block);
    console.log("bbb", block.transactions);

    const fullTransactions = await Promise.all(
        block.transactions.map(async (txHash) => {
            try {
                const txn = await sepoliaClient.getTransaction({ hash: txHash });
                if (!txn || txn.value === undefined) {
                    console.warn(`Skipping invalid transaction: ${txHash}`);
                    return null;
                }
                return txn;
            } catch (error) {
                console.error(`Error fetching transaction ${txHash}:`, error);
                return null;
            }
        })
    );

    // Filter out null transactions
    const validTransactions = fullTransactions.filter(txn => txn !== null);

    console.log("Valid Transactions:", validTransactions);

    // console.log("Full:", fullTransactions);
    const interested = await fetchUsersDepositAddresses();
    console.log("Inside", interested);

    for (const txn of fullTransactions) {
        //@ts-ignore
        const InterestedTxns = txn.to && interested.includes(txn.to);
        if (InterestedTxns) {
            console.log("Eth Address :", txn?.to);
            console.log("Received amount :", txn?.value)
            if (txn?.to) {
                setBalance("sepolia", txn.to, txn?.value);
            }
        }
    }

    await updatelastProcessedBlock("sepolia", Number(latestBlock));


}


const getApeTransferFromBlock = async () => {

    const lastProcessedBlock = await getLastProcessedBlock("curtis") || 16042546;
    const latestBlock = await apechainClient.getBlockNumber();

    if (lastProcessedBlock == Number(latestBlock))
        return;

    // console.log(latestBlock);
    const block = await apechainClient.getBlock({ blockNumber: latestBlock });
    // console.log("Ape Block txn", block?.transactions, block?.length);

    const fullTransaction = await Promise.all(
        //@ts-ignore
        block?.transactions?.map(txHash => apechainClient.getTransaction(txHash))
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
            if (txn?.to) {
                setBalance("curtis", txn.to, txn?.value);
            }

        }
    }

    await updatelastProcessedBlock("curtis", Number(latestBlock));
}

const main = async () => {
    await mongoose.connect("mongodb+srv://farman32740:f%40rman32740@cluster0.wvi5a.mongodb.net/ETH-Indexer");
    console.log("db connected")
    setInterval(() => getETHTransfersFromBlock(), 5000);
    setInterval(() => getApeTransferFromBlock(), 1000);
}

main();