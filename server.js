const express = require("express");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const PORT = 5000;


app.use(cors({
  origin: "http://localhost:5173",  
  methods: ["POST", "GET"],
  allowedHeaders: ["Content-Type"]
}));
app.use(express.json());


let playerBalance = 1000;


const generateHash = (seed, roll) => {
    return crypto.createHash("sha256").update(seed + roll).digest("hex");
};


app.post("/roll-dice", (req, res) => {
    const { betAmount } = req.body;

    if (!betAmount || betAmount <= 0) {
        return res.status(400).json({ error: "Invalid bet amount" });
    }

    if (betAmount > playerBalance) {
        return res.status(400).json({ error: "Insufficient balance" });
    }

  
    const roll = Math.floor(Math.random() * 6) + 1;

   
    const serverSeed = "secure-seed";
    const hash = generateHash(serverSeed, roll);

    let result;
    if (roll >= 4) {
        playerBalance += betAmount; 
        result = { win: true, payout: betAmount * 2, newBalance: playerBalance };
    } else {
        playerBalance -= betAmount; 
        result = { win: false, payout: 0, newBalance: playerBalance };
    }

    res.json({
        roll,
        ...result,
        hash, 
        message: result.win ? "You won!" : "You lost!",
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
