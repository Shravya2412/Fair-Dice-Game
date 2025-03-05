import { useState } from "react";

export default function App() {
    const [betAmount, setBetAmount] = useState(10);
    const [balance, setBalance] = useState(1000);
    const [result, setResult] = useState(null);
    const [rolling, setRolling] = useState(false);

    const rollDice = async () => {
        if (betAmount <= 0 || betAmount > balance) {
            alert("Invalid bet amount!");
            return;
        }

        setRolling(true);

        try {
            const response = await fetch("http://localhost:5000/roll-dice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ betAmount }),
            });

            const data = await response.json();

            if (data.error) {
                alert(data.error);
                setRolling(false);
                return;
            }

            setResult(data);
            setBalance(data.newBalance);
        } catch (error) {
            alert("Error rolling dice.");
        } finally {
            setRolling(false);
        }
    };
   
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
            <h1 className="text-3xl font-bold mb-4">🎲 Provably Fair Dice Game</h1>
            
            <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
                <p className="text-lg mb-2">Balance: ${balance}</p>
                
                <input
                    type="number"
                    value={betAmount}
                    onChange={(e) => setBetAmount(Number(e.target.value))}
                    className="w-full p-2 mb-4 text-black rounded"
                    min="1"
                    max={balance}
                />
                
                <button 
                    onClick={rollDice}
                    disabled={rolling}
                    className={`px-6 py-2 font-bold rounded ${rolling ? "bg-gray-600" : "bg-green-500 hover:bg-green-600"}`}
                >
                    {rolling ? "Rolling..." : "Roll Dice"}
                </button>

                {result && (
                    <div className="mt-4 p-4 bg-gray-700 rounded">
                        <p className="text-xl">🎲 Rolled: {result.roll}</p>
                        <p className={`font-bold ${result.win ? "text-green-400" : "text-red-400"}`}>
                            {result.message}
                        </p>
                        <p>New Balance: ${result.newBalance}</p>
                        <p className="text-xs mt-2 text-gray-400">Hash: {result.hash}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
