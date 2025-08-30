const crypto = require("crypto");
const ApprovedSensor = require("../models/approvedSensor");
const GreenCoin = require("../models/greenCoin");
const { uploadToIPFS } = require("../utils/ipfs");          // mock for now :contentReference[oaicite:3]{index=3}
const { mintGreenCoins } = require("../blockchain.sol");  // mock for now :contentReference[oaicite:4]{index=4}

const SECRET = process.env.IOT_SECRET || "superSecretKey123";

const verifySensor = async (partId) => {
  const recomputed = crypto.createHash("sha256").update(SECRET + partId).digest("hex");
  const rec = await ApprovedSensor.findOne({ partId, approvedHash: recomputed, active: true });
  return !!rec;
};

/**
 * @route POST /api/mint/verify-and-mint
 * Body: { batchId, partId, producerId, producerName, hydrogenQty, purity, renewableShare, powerConsumption, powerFromRenewable, timestamp }
 */
exports.verifyAndMint = async (req, res) => {
  try {
    const {
      batchId, partId, producerId, producerName,
      hydrogenQty, purity, renewableShare, powerConsumption, powerFromRenewable, timestamp
    } = req.body;

    // 1) Verify device
    const ok = await verifySensor(partId);
    if (!ok) return res.status(403).json({ message: "Sensor not approved" });

    // 2) Upload complete batch record to IPFS
    const payload = {
      batchId, partId, producerId, producerName,
      hydrogenQty, purity, renewableShare, powerConsumption, powerFromRenewable, timestamp
    };
    const ipfsCid = await uploadToIPFS(payload); // mocked CID for now :contentReference[oaicite:5]{index=5}

    // 3) Compute coins (1 coin = 1000 kg) and mint via chain
    const coins = Math.floor(hydrogenQty / 1000);
    if (coins <= 0) return res.status(400).json({ message: "Insufficient hydrogen to mint a coin" });

    const mintTxHash = await mintGreenCoins(producerId, coins, ipfsCid); // mocked tx hash now :contentReference[oaicite:6]{index=6}

    // 4) Store on DB
    // tokenId can be derived (e.g., sha256(ipfsCid) or real on-chain ID if contract returns it)
    const tokenId = crypto.createHash("sha256").update(ipfsCid).digest("hex").slice(0, 16);

    const coin = await GreenCoin.create({
      batchId,
      producerId,
      producerName,
      ipfsCid,
      hydrogenQtyKg: hydrogenQty,
      purity,
      renewableShare,
      tokenId,
      amount: coins,
      mintTxHash,
      status: "MINTED",
      auditorVerified: true,
      currentOwnerType: "PRODUCER",
      currentOwnerId: producerId
    });

    res.status(201).json({ message: "Verified + minted", coin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Mint flow failed", error: err.message });
  }
};
