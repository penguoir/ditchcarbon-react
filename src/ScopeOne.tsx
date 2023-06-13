import { FormControl } from "@mui/base";
import {
	Select,
	InputLabel,
	MenuItem,
	TextField,
	Button,
	FormHelperText,
	Autocomplete,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import "./css/App.css";

// helpers
import { filterDataByScope } from "./helpers/filterFunctions";
import resetStates from "./helpers/resetStates";
import { options } from "./helpers/apiOptions";
import supportedRegions from "./helpers/supportedRegions.json";
import scopeOneCategories from "./data/scopeOneCategories.json";

// interfaces
import { Dictionary } from "./interfaces/Dictionary";
import { AssessmentOfActivity } from "./interfaces/AssessmentOfActivity";
import { ActivityArray } from "./interfaces/ActivityArray";
import { CategoryItem } from "./interfaces/CategoryItem";

// App component
function App() {
	// define all states

	const [apiKey, setApiKey] = useState<string>("");

	const [categories, setCategories] = useState<string[]>([]);
	const [category, setCategory] = useState<string>("");
	const [categoryDisabled, setCategoryDisabled] = useState<boolean>(true);

	const [activities, setActivities] = useState<ActivityArray>([]);
	const [activity, setActivity] = useState<string>("");
	const [activityIndex, setActivityIndex] = useState<number>(0);
	const [activitiesError, setActivitiesError] = useState<string>("");
	const [activityDisabled, setActivityDisabled] = useState<boolean>(true);

	const [units, setUnits] = useState<string[]>([]);
	const [unit, setUnit] = useState<string>("");
	const [unitDisabled, setUnitDisabled] = useState<boolean>(true);

	const [region, setRegion] = useState<string>("GLOBAL");
	const [regionError, setRegionError] = useState<string>("");
	const [regionDisabled, setRegionDisabled] = useState<boolean>(true);

	const [years, setYears] = useState<number[]>([]);
	const [year, setYear] = useState<number>(2020);

	const [volume, setVolume] = useState<number>(0);
	const [volumeDisabled, setVolumeDisabled] = useState<boolean>(true);
	const [yearDisabled, setYearDisabled] = useState<boolean>(true);

	const [co2Total, setCo2Total] = useState<number>(0);

	// get categories
	const getCategories = async () => {
		// only do api call if length of region greater than or equal to 2
		if (region.length < 2) return;

		let api_endpoint =
			"https://api.ditchcarbon.com/v1.0/activities/top-level";

		// if region !== "GLOBAL", add region to url
		api_endpoint =
			region !== "GLOBAL"
				? api_endpoint.concat("?region=" + region)
				: api_endpoint;

		// fetch data
		fetch(api_endpoint, options)
			.then((response) => response.json())
			.then((response) => {
				if (response.length === 0) {
					// if response is empty, reset all necessary states
					resetStates({
						setCategories,
						setCategory,
						setActivities,
						setActivity,
						setActivityIndex,
						setUnits,
						setUnit,
						setYears,
						setYear,
						setVolume,
						setCo2Total,
					});

					// put message under region input field
					setRegionError(
						"We currently do not support this region, type global to get all categories."
					);
					return;
				}

				// reset region error
				setRegionError("");

				const responseNames = response.map(
					(obj: CategoryItem) => obj.name
				);
				const scopeOneNames = scopeOneCategories.map(
					(obj: CategoryItem) => obj.name
				);

				console.log(response);
				console.log(scopeOneCategories);

				console.log(responseNames);
				console.log(scopeOneNames);

				const commonNames = responseNames.filter((name: string) =>
					scopeOneNames.includes(name)
				);

				console.log(commonNames);

				const overlap = response.filter((obj: CategoryItem) =>
					commonNames.includes(obj.name)
				);

				if (commonNames.length === 0){
					setRegionError("There are no scope 1 activities for this region, please choose another.")
				}

				console.log(overlap);

				// set categories
				setCategories(
					overlap.map((item: Dictionary<string>) => {
						return item.name;
					})
				);

				// set category
				setCategory(overlap[0].name);
			});
	};

	// get activities
	const getActivities = async () => {
		// fetch activities based on category
		fetch(
			`https://api.ditchcarbon.com/v1.0/activities?name[]=${category}`,
			options
		)
			.then((response) => response.json())
			.then((response) => {
				// filter activites to just "Scope 1" using helper function
				const filteredActivities = filterDataByScope(
					response,
					"Scope 1"
				);

				// reset activities error
				setActivitiesError("");

				//if filteredActivities is empty, update error message
				if (filteredActivities.length === 0) {
					setActivitiesError(
						"There are no Scope 1 emission activities for this category, please choose another."
					);
				}

				// set activities
				setActivities(filteredActivities);

				// set activity index
				setActivityIndex(0);
			})
			.catch((err) => console.error(err));
	};

	// get assessment of activity
	const getAssessmentOfActivity = async () => {
		// fetch assessment of activity
		fetch(
			`https://api.ditchcarbon.com/v1.0/activities/${activities[activityIndex].id}/assessment?region=${region}&declared_unit=${unit}`,
			options
		)
			.then((response) => response.json())
			.then((response: AssessmentOfActivity) => {
				// conditionally get co2 emission factor
				const factor =
					response.ghg_emission_factors.co2e !== null
						? response.ghg_emission_factors.co2e
						: response.ghg_emission_factors.co2;

				// set co2 total
				setCo2Total(factor * volume);
			})
			.catch((err) => console.error(err));
	};

	// useEffects

	// when category or categories changes
	useEffect(() => {
		// if category is not empty, get activities
		category && getActivities();

		// if category is empty, disable activity select otherwise enable it
		category.length === 0
			? setActivityDisabled(true)
			: setActivityDisabled(false);
	}, [category, categories]);

	// when activityIndex or activities changes
	useEffect(() => {
		// udate units array
		setUnits(activities[activityIndex]?.available_declared_units);

		// update current activity
		setActivity(activities[activityIndex]?.name.slice(-3).join(", ") ?? "");

		// update years array
		setYears(activities[activityIndex]?.available_years);

		// if activities is empty, disable unit select otherwise enable it
		activities.length === 0
			? setYearDisabled(true)
			: setYearDisabled(false);
		activities.length === 0
			? setUnitDisabled(true)
			: setUnitDisabled(false);
	}, [activityIndex, activities]);

	// when years changes
	useEffect(() => {
		// if years is not empty, set year to first year in array
		years && setYear(years[0]);
	}, [years]);

	// when units changes
	useEffect(() => {
		// if units is not empty, set unit to first unit in array
		units && setUnit(units[0]);

		// if units is empty, disable volume input field otherwise enable it
		units
			? units.length === 0
				? setVolumeDisabled(true)
				: setVolumeDisabled(false)
			: setVolumeDisabled(true);
	}, [units]);

	// when unit changes
	useEffect(() => {
		// get categories
		getCategories();
	}, [region]);

	// when apiKey changes
	useEffect(() => {
		// update options object with new api key after "Bearer "
		options.headers.authorization = `Bearer ${apiKey}`;

		// if apiKey is empty, disable region select otherwise enable it
		apiKey.length === 0
			? setRegionDisabled(true)
			: setRegionDisabled(false);
		apiKey.length === 0
			? setCategoryDisabled(true)
			: setCategoryDisabled(false);
		// get categories
		getCategories();
	}, [apiKey]);

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
					<h1 id="title">Scope 1 Emissions Calculator</h1>
				</span>
			</header>
			<div id="main-container">
				<div id="main">
					{/* API key */}
					<FormControl>
						<InputLabel id="api-key-label">API Key</InputLabel>
						<TextField
							id="outlined-basic"
							value={apiKey}
							variant="outlined"
							onChange={(e) => setApiKey(e.target.value)}
						/>
					</FormControl>
					{apiKey.length === 0 && (
						<FormHelperText>
							Don't have one? Head over{" "}
							<a href="https://ditchcarbon.com/get-started/">
								here
							</a>
						</FormHelperText>
					)}
					{/* Region */}
					<FormControl>
						<InputLabel id="region-select-label">Region</InputLabel>
						<Autocomplete
							disablePortal
							id="outlined-basic"
							options={supportedRegions.regions}
							value={region}
							{...(regionDisabled
								? {
										sx: {
											backgroundColor: "#D3D3D3",
											width: 165,
										},
								  }
								: { sx: { width: 165 } })}
							disabled={regionDisabled}
							renderInput={(params) => <TextField {...params} />}
							onChange={(_, value) => setRegion(value ?? "")}
						/>
					</FormControl>
					{regionError && (
						<FormHelperText id="region-error">
							{regionError}
						</FormHelperText>
					)}
					{/* Category */}
					<FormControl>
						<InputLabel id="category-select-label">
							Category
						</InputLabel>
						<Autocomplete
							disablePortal
							id="combo-box-demo"
							options={categories}
							value={category}
							renderInput={(params) => <TextField {...params} />}
							onChange={(_, value) => setCategory(value ?? "")}
							{...(categoryDisabled
								? {
										sx: {
											backgroundColor: "#D3D3D3",
											width: 300,
										},
								  }
								: { sx: { width: 300 } })}
							disabled={categoryDisabled}
						/>
					</FormControl>
					{activitiesError && (
						<FormHelperText id="activities-error">
							{activitiesError}
						</FormHelperText>
					)}
					{/* Activity */}
					<FormControl>
						<InputLabel id="activity-select-label">
							Activity
						</InputLabel>
						<Select
							id="activity-select"
							value={activityIndex}
							label="Activity"
							{...(activityDisabled
								? { sx: { backgroundColor: "#D3D3D3" } }
								: {})}
							disabled={activityDisabled}
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
					{/* Unit */}
					<FormControl>
						<InputLabel id="unit-select-label">Unit</InputLabel>
						<Select
							id="unit-select"
							value={unit}
							label="Unit"
							{...(unitDisabled
								? { sx: { backgroundColor: "#D3D3D3" } }
								: {})}
							disabled={unitDisabled}
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
					{/* Volume */}
					<FormControl>
						<InputLabel id="volume-select-label">Volume</InputLabel>
						<TextField
							id="outlined-basic"
							variant="outlined"
							type={"number"}
							value={volume}
							{...(volumeDisabled
								? { sx: { backgroundColor: "#D3D3D3" } }
								: {})}
							disabled={volumeDisabled}
							onChange={(e) =>
								setVolume(parseInt(e.target.value.toString()))
							}
						/>
					</FormControl>
					{/* Year */}
					<FormControl>
						<InputLabel id="year-select-label">Year</InputLabel>
						<Select
							id="year-select"
							value={year}
							label="Year"
							{...(yearDisabled
								? { sx: { backgroundColor: "#D3D3D3" } }
								: {})}
							disabled={yearDisabled}
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
