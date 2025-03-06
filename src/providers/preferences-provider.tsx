"use client";

import { UserType } from "@/lib/db/schemas/auth-schema";
import { PreferencesType } from "@/lib/db/schemas/preference";
import request from "@/lib/request";
import { createContext, ReactNode, useContext, useState } from "react";

/**
 * The props for this provider.
 */
type PreferencesProviderProps = {
	/**
	 * The current user.
	 */
	user: UserType;

	/**
	 * The children to render.
	 */
	children: ReactNode;
};

/**
 * The props for the context.
 */
type PreferencesContextProps = {
	/**
	 * The preferences for the user.
	 */
	preferences: PreferencesType | undefined;

	/**
	 * Update the preferences.
	 *
	 * @param updates the updates to make
	 */
	updatePreferences: (updates: Partial<PreferencesType>) => void;
};

/**
 * The current context of the socket.
 */
const PreferencesContext = createContext<PreferencesContextProps>({
	preferences: undefined,

	updatePreferences: () => {
		throw new Error("PreferencesContext is not defined.");
	},
});

/**
 * The hook to use the preferences context.
 */
export const usePreferences = (): PreferencesContextProps => {
	return useContext(PreferencesContext);
};

const PreferencesProvider = ({ user, children }: PreferencesProviderProps) => {
	const [preferences, setPreferences] = useState<PreferencesType>(
		user.preferences
	);

	const updatePreferences = async (updates: Partial<PreferencesType>) => {
		setPreferences((prev) => ({ ...prev, ...updates }));
		await request.post("/api/user/update-preference", {
			data: updates,
		});
	};

	return (
		<PreferencesContext.Provider value={{ preferences, updatePreferences }}>
			{children}
		</PreferencesContext.Provider>
	);
};
export default PreferencesProvider;
