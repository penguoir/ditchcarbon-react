type Props = {
	setCategories: React.Dispatch<React.SetStateAction<any[]>>;
	setCategory: React.Dispatch<React.SetStateAction<string>>;
	setActivities: React.Dispatch<React.SetStateAction<any[]>>;
	setActivity: React.Dispatch<React.SetStateAction<string>>;
	setActivityIndex: React.Dispatch<React.SetStateAction<number>>;
	setUnits: React.Dispatch<React.SetStateAction<any[]>>;
	setUnit: React.Dispatch<React.SetStateAction<string>>;
	setYears: React.Dispatch<React.SetStateAction<any[]>>;
	setYear: React.Dispatch<React.SetStateAction<number>>;
	setVolume: React.Dispatch<React.SetStateAction<number>>;
	setCo2Total: React.Dispatch<React.SetStateAction<number>>;
};

const resetStates = (props: Props): void => {
	const {
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
	} = props;

	setCategories([]);
	setCategory("");
	setActivities([]);
	setActivity("");
	setActivityIndex(0);
	setUnits([]);
	setUnit("");
	setYears([]);
	setYear(0);
	setVolume(0);
	setCo2Total(0);
};

export default resetStates;
