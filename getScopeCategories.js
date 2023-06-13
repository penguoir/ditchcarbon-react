// Run with `node getScopeCategories.js`
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const categories = require("./src/data/categories.json");
require('dotenv').config();

let options = {
	method: "GET",
	headers: {
		accept: "application/json",
		authorization: `Bearer key`,
	},
};

options.headers.authorization = `Bearer ${
	process.env.VITE_DITCH_CARBON_API_KEY
}`;

console.log(options)

async function fetchActivitiesByCategory(category) {
	const response = await fetch(
		`https://api.ditchcarbon.com/v1.0/activities?name[]=${category}`,
		options
	);
	
	const data = await response.json();
	console.log(data)
	return data;
}

const scope1Categories = [];
const scope2Categories = [];
const scope3Categories = [];

// Assuming you have the categories and activities data available in variables

// Iterate over the categories
for (const category of categories) {
	// Fetch activities for the category
	const activities = await fetchActivitiesByCategory(category.name);

	// Check if any activity has scope 1, 2, or 3
	const hasScope1 = activities.some((activity) =>
		activity.name.includes("Scope 1")
	);
	const hasScope2 = activities.some((activity) =>
		activity.name.includes("Scope 2")
	);
	const hasScope3 = activities.some((activity) =>
		activity.name.includes("Scope 3")
	);

	// Categorize the category based on the scope of emissions
	if (hasScope1) {
		scope1Categories.push(category);
	}
	if (hasScope2) {
		scope2Categories.push(category);
	}
	if (hasScope3) {
		scope3Categories.push(category);
	}
}

const scope1JSON = JSON.stringify(scope1Categories);
const scope2JSON = JSON.stringify(scope2Categories);
const scope3JSON = JSON.stringify(scope3Categories);

const fs = require("fs"); // Require the 'fs' module for file operations

// Save the JSON strings to separate files
fs.writeFile("scopeOneCategories.json", scope1JSON, (err) => {
	if (err) throw err;
	console.log("scopeOneCategories.json file has been saved!");
});

fs.writeFile("scopeTwoCategories.json", scope2JSON, (err) => {
	if (err) throw err;
	console.log("scopeTwoCategories.json file has been saved!");
});

fs.writeFile("scopeThreeCategories.json", scope3JSON, (err) => {
	if (err) throw err;
	console.log("scopeThreeCategories.json file has been saved!");
});
