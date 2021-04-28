import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

// this first application assumes that metamask is installed.
// web 3 gotchas
// metamask AUTOMATICALLY injects a web 3 instance into any webpage.  We want a DIFFERENT one, so
// we can control it, and use the API we want, instead of an older one.
// Howeer, we do want to rip out the PROVIDER of the old version, since it has the keys
// of the user, and splice it into the new version.

function App() {
	const [manager, setMangager] = useState();
	const [players, setPlayers] = useState([]);
	const [balance, setBalance] = useState();
	const [ethValue, setEthValue] = useState(0);
	const [message, setMessage] = useState("");
	const [isPending, setIsPending] = useState(false);
	const [accounts, setAccounts] = useState([]);
	const [lastWinner, setLastWinner] = useState();

	useEffect(() => {
		fetchManager();
		fetchBalance();
		fetchPlayers();
		fetchAccounts();
	}, []);

	async function fetchManager() {
		// no "from" param is needed for the call, due to metamask.  Default account is already set
		const manager = await lottery.methods.manager().call();
		setMangager(manager);
	}

	async function fetchPlayers() {
		const players = await lottery.methods.getPlayers().call();
		setPlayers(players);
	}

	async function fetchBalance() {
		const balance = await web3.eth.getBalance(lottery.options.address);
		setBalance(balance);
	}

	async function fetchAccounts() {
		const accounts = await web3.eth.getAccounts();
		setAccounts(accounts);
	}

	async function fetchLastWinner() {
		const winner = await lottery.methods.lastWinner().call();
		setLastWinner(winner);
	}

	const onPickWinner = async (e) => {
		e.preventDefault();
		setIsPending(true);

		try {
			setMessage("Processing...");
			console.log(`account used: ${accounts[0]}`);
			await lottery.methods.pickWinner().send({
				from: accounts[0],
			});
			const winner = await lottery.methods.lastWinner().call();
			// setMessage("Winner chosen!");
			// fetchBalance();
			// fetchPlayers();
			setMessage(`${winner} is the winner!`);
		} catch (err) {
			setMessage(
				"Something went wrong.  Maybe you are not the manager of this lottery?"
			);
			console.error(err);
		}
		setIsPending(false);
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		if (isPending) return;

		setIsPending(true);
		try {
			setMessage("Processing...");

			await lottery.methods.enter().send({
				from: accounts[0],
				value: web3.utils.toWei(ethValue, "ether"),
			});

			setMessage("You have been entered! :)");

			setEthValue(0);

			fetchPlayers();
			fetchBalance();
		} catch (err) {
			setMessage("Something went wrong.  Please try again later.");
			console.error(err);
		}

		setIsPending(false);
	};

	return (
		<div>
			<h2>Lottery Contract</h2>
			<p>This contract is managed by: {manager ? manager : "loading..."}</p>
			<p>There are currently {players.length} people entered.</p>
			{balance && (
				<p>
					They are competing to win {web3.utils.fromWei(`${balance}`, "ether")}{" "}
					ether!
				</p>
			)}
			{}
			<hr />
			<form onSubmit={onSubmit}>
				<h4>Want to try your luck?</h4>
				<div>
					<label>Amount of ether to enter</label>
					<input onChange={(e) => setEthValue(e.target.value)} />
				</div>
				<button type="submit">Enter</button>
			</form>
			<hr />
			<h1>{message}</h1>
			{manager === accounts[0] && (
				<div>
					<h4>Time to pick a winner?</h4>
					<button onClick={onPickWinner}>Pick winner</button>
				</div>
			)}
		</div>
	);
}

export default App;
