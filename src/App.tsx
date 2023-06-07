import { FormControl } from "@mui/base";
import { Select, InputLabel, MenuItem, TextField, Button, InputAdornment, OutlinedInput } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./css/App.css";
import { createTheme } from "@mui/material/styles";
import { purple } from "@mui/material/colors";

const theme = createTheme({
	palette: {
		primary: {
			main: purple[500],
		},
		secondary: {
			main: "#f44336",
		},
	},
});

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

interface EmissionFactors {
	ch4: number;
	co2: number;
	co2e: number | null;
	n2o: number;
}
interface AssessmentOfActivity {
	region: string;
	year: number;
	declared_unit: string;
	ghg_emission_factors: EmissionFactors;
	source_url: string;
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

	const [region, setRegion] = useState<string>("");

	const [years, setYears] = useState<number[]>([]);
	const [year, setYear] = useState<number>();

	const [volume, setVolume] = useState<number>(0);

	const [co2Total, setCo2Total] = useState<number>(0);

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
				setActivity(
					activities[activityIndex].name.slice(-3).join(", ")
				);
				setUnits(activities[activityIndex].available_declared_units);
				setUnit(units[0]);
				setYears(activities[activityIndex].available_years);
				console.log(activities[activityIndex])
				setYear(years[0]);
			})
			.catch((err) => console.error(err));
	};

	const getAssessmentOfActivity = async () => {
		fetch(
			`https://api.ditchcarbon.com/v1.0/activities/${activities[activityIndex].id}/assessment?region=${region}&declared_unit=${unit}`,
			options
		)
			.then((response) => response.json())
			.then((response: AssessmentOfActivity) => {
				console.log(response);
				const factor =
					response.ghg_emission_factors.co2e !== null
						? response.ghg_emission_factors.co2e
						: response.ghg_emission_factors.co2;
				setCo2Total(factor * volume);
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
		console.log(activities[activityIndex]?.available_declared_units);
		setUnits(activities[activityIndex]?.available_declared_units);
	}, [activityIndex, activities]);

	useEffect(() => {
		units && setUnit(units[0]);
	}, [units]);

	return (
		<>
			<header>
				<img
					width="283"
					height="38"
					src="https://ditchcarbon.com/wp-content/uploads/2021/05/Group-119.svg"
					alt=""
					loading="lazy"
				/>
				<span>
					<h1 id="title">Emissions Calculator</h1>
				</span>
			</header>
			<div id="main-container">
				<div id="main">
					<FormControl>
						<InputLabel id="category-select-label">
							Category
						</InputLabel>
						<Select
							id="category-select"
							value={category}
							label="Category"
							onChange={(e) => setCategory(e.target.value)}
						>
							{categories.length !== 0 ? (
								categories.map((category) => {
									return (
										<MenuItem
											key={category}
											value={category}
										>
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
						<InputLabel id="activity-select-label">
							Activity
						</InputLabel>
						<Select
							id="activity-select"
							value={activityIndex}
							label="Activity"
							onChange={(e) => {
								console.log(e.target.value);
								const index = parseInt(
									e.target.value.toString()
								);
								setActivityIndex(index);
								const current_activity = activities[index];
								const activity_name = current_activity.name
									.slice(-3)
									.join(", ");
								setActivity(activity_name);
							}}
						>
							{activities ? (
								activities.map((activity, index) => {
									return (
										<MenuItem
											key={activity.id}
											value={index}
										>
											{activity.name.slice(-3).join(", ")}
										</MenuItem>
									);
								})
							) : (
								<MenuItem key="loading">
									Select a category
								</MenuItem>
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
								setUnit(e.target.value);
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
								<MenuItem key="loading">
									Select a category
								</MenuItem>
							)}
						</Select>
					</FormControl>
					<FormControl>
						<InputLabel id="region-select-label">Region</InputLabel>
						<TextField
							id="outlined-basic"
							value={region}
							variant="outlined"
							onChange={(e) => setRegion(e.target.value)}
						/>
					</FormControl>
					<FormControl>
						<InputLabel id="volume-select-label">Volume</InputLabel>
						<OutlinedInput
							endAdornment={<InputAdornment position="end">{unit}</InputAdornment>}
							id="outlined-basic"
							type={"number"}
							value={volume}
							onChange={(e) =>
								setVolume(parseInt(e.target.value.toString()))
							}
						/>
					</FormControl>
					<FormControl>
						<InputLabel id="year-select-label">Year</InputLabel>
						<Select
							id="year-select"
							value={year}
							label="Year"
							onChange={(e) => {
								setYear(Number(e.target.value));
							}}
						>
							{years ? (
								years.map((year, index) => {
									return (
										<MenuItem key={index} value={year}>
											{year}
										</MenuItem>
									);
								})
							) : (
								<MenuItem key="loading">
									Select the year
								</MenuItem>
							)}
						</Select>
					</FormControl>
					<br />
					<Button
						onClick={() => getAssessmentOfActivity()}
						variant="outlined"
					>
						Calculate
					</Button>
					<br />
					{co2Total !== 0 && (
						<div id="co2-total">{co2Total} kg co2e total</div>
					)}
				</div>
			</div>
		</>
	);
}

export default App;
