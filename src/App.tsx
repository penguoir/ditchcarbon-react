import { FormControl } from "@mui/base";
import { Select, InputLabel, MenuItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./css/App.css";

// template for fetch request
const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		authorization: `Bearer ${import.meta.env.VITE_DITCH_CARBON_API_KEY}`,
	},
};

// dictionary interface
interface Dictionary<T> {
	[Key: string]: T;
}

// activity interface
interface Activity {
	id: string;
	name: string[];
	available_years: number[];
	available_declared_units: string[];
}

// activity array interface
interface ActivityArray extends Array<Activity> {}

function App() {
	// define all states
	const [categories, setCategories] = useState<string[]>([]);
	const [category, setCategory] = useState<string>("");

	const [activities, setActivities] = useState<ActivityArray>([]);
	const [activity, setActivity] = useState<string>("Activity");
	const [activityIndex, setActivityIndex] = useState<number>(0);

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
				setCategory(response[0].name);
			})
			.catch((err) => console.error(err));
	};

	const getActivities = async () => {
		fetch(
			`https://api.ditchcarbon.com/v1.0/activities?name[]=${category}`,
			options
		)
			.then((response) => response.json())
			.then((response) => {
				console.log(response);
				setActivities(response);
				setActivityIndex(0);
				setActivity(activities[activityIndex].name.slice(-3).join(", "));
				setUnits(activities[activityIndex].available_declared_units);
				setUnit(units[0])
			})
			.catch((err) => console.error(err));
	};

	useEffect(() => {
		getCategories();
	}, []);

	useEffect(() => {
		console.log(category);
		category && getActivities();
	}, [category, categories]);

	useEffect(() => {
		console.log(activities[activityIndex]?.available_declared_units)
		setUnits(activities[activityIndex]?.available_declared_units)
	}, [activityIndex, activities])
	
	useEffect(() => {
		units && setUnit(units[0])
	}, [units])

	return (
		<>
			<FormControl>
				<InputLabel id="category-select-label">Category</InputLabel>
				<Select
					id="category-select"
					value={category}
					label="Category"
					onChange={(e) => setCategory(e.target.value)}
				>
					{categories.length !== 0 ? (
						categories.map((category) => {
							return (
								<MenuItem key={category} value={category}>
									{category}
								</MenuItem>
							);
						})
					) : (
						<MenuItem key="loading">loading...</MenuItem>
					)}
				</Select>
			</FormControl>
			<FormControl>
				<InputLabel id="activity-select-label">Activity</InputLabel>
				<Select
					id="activity-select"
					value={activityIndex}
					label="Activity"
					onChange={(e) => {
						console.log(e.target.value);
						const index = parseInt(e.target.value.toString());
						setActivityIndex(index);
						let current_activity = activities[index];
						let activity_name = current_activity.name
							.slice(-3)
							.join(", ");
						setActivity(activity_name);
					}}
				>
					{activities ? (
						activities.map((activity, index) => {
							return (
								<MenuItem key={activity.id} value={index}>
									{activity.name.slice(-3).join(", ")}
								</MenuItem>
							);
						})
					) : (
						<MenuItem key="loading">Select a category</MenuItem>
					)}
				</Select>	
			</FormControl>
			<FormControl>
				<InputLabel id="unit-select-label">Unit</InputLabel>
				<Select
					id="unit-select"
					value={unit}
					label="Unit"
					onChange={(e) => {
						setUnit(e.target.value)
					}}
				>
					{units ? (
						units.map((unit, index) => {
							return (
								<MenuItem key={index} value={unit}>
									{unit}
								</MenuItem>
							);
						})
					) : (
						<MenuItem key="loading">Select a category</MenuItem>
					)}
				</Select>	
			</FormControl>
		</>
	);
}

export default App;
