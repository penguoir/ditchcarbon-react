import { Activity } from "../interfaces/Activity";

export const filterDataByScope = (activities: Activity[], scope:string): Activity[] => {
	const filteredData = activities.filter((activity) => {
		const name = activity.name;
		return name.includes(scope);
	});

	return filteredData;
};
