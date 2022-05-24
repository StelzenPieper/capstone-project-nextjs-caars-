import create from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';

const useStore = create(
	persist(
		set => ({
			myVehicles: [],
			vinFound: '',
			modalState: false,
			toggleModalState: () => {
				set(state => ({ modalState: !state.modalState }));
			},
			toggleFavoriteCar: caarsId => {
				set(state => ({
					myVehicles: state.myVehicles.map(vehicle =>
						vehicle.caarsId === caarsId
							? { ...vehicle, favorite: !vehicle.favorite }
							: vehicle
					),
				}));
			},
			fetchVehicleData: async vinValue => {
				const url = `https://vindecodervehicle.com/api/v1/?id=${process.env.VIN_API_ID}&key=${process.env.VIN_API_KEY}&vin=${vinValue}&getMoreData`;
				try {
					const response = await fetch(url);
					const data = await response.json();
					set(state => {
						return {
							myVehicles: [
								...state.myVehicles,
								{ ...data, vinValue, caarsId: nanoid(), favorite: false },
							],
						};
					});
					set({ vinFound: true });
				} catch (error) {
					console.error(`Ooops we had an error: ${error}`);
					set({ vinFound: false });
				}
			},
		}),
		{ name: 'caars' }
	)
);

export default useStore;
