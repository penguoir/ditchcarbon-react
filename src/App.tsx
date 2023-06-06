import { useEffect, useState } from "react";
import "./css/App.css";

const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		authorization: "Bearer 119807b0526cb12971d817ec34e60a8b",
	},
};

interface Dictionary<T> {
	[Key: string]: T;
}

interface Activity {
	id: string;
	name: string[];
	available_years: number[];
	available_declared_units: string[];
}

interface ActivityArray extends Array<Activity> {}

function App() {
	const [categories, setCategories] = useState<string[]>([]);
	const [category, setCategory] = useState<string>("");

	const [activities, setActivities] = useState<ActivityArray>([]);
	const [activity, setActivity] = useState<Activity>();

	const [units, setUnits] = useState<string[]>([]);
	const [unit, setUnit] = useState<string>("");

	const getCategories = async () => {
		fetch("https://api.ditchcarbon.com/v1.0/activities/top-level", options)
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				setCategories(
					response.map((item: Dictionary<string>) => {
						return item.name;
					})
				);
			})
			.catch((err) => console.error(err));
	};

	const getActivities = async () => {
		fetch("https://api.ditchcarbon.com/v1.0/activities", options)
			.then((response) => response.json())
			.then((response) => console.log(response))
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		getCategories();
	}, []);

	useEffect(() => {
		console.log(category);
		getActivities();
	}, [category]);

	return (
		<>
			<select onChange={(e) => setCategory(e.target.value)}>
				{categories.length !== 0 ? (
					categories.map((category) => {
						return (
							<option key={category} value={category}>
								{category}
							</option>
						);
					})
				) : (
					<option key="loading">loading...</option>
				)}
			</select>
			<select onChange={(e) => setActivity(e.target.value)}>
				{activities.length !== 0 ? (
					activities.map((activity) => {
						return (
							<option key={activity} value={activity}>
								{activity}
							</option>
						);
					})
				) : (
					<option key="loading">Select a category</option>
				)}
			</select>
		</>
	);
}

export default App;