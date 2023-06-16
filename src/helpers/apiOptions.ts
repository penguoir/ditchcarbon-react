import { Options } from "../interfaces/Options";

// template for fetch request
// eslint-disable-next-line prefer-const
export let options: Options = {
	method: "GET",
	headers: {
		accept: "application/json",
		authorization: `Bearer key`,
	},
};