interface Activity {
	id: string;
	name: string[];
	available_years: number[];
	available_declared_units: string[];
  }

export const filterDataByScope = (activities: Activity[], scope:string): Activity[] => {
	const filteredData = activities.filter((activity) => {
		const name = activity.name;
		return name.includes(scope);
	});

	return filteredData;
};
