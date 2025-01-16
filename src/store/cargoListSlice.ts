import { createSlice } from "@reduxjs/toolkit";

enum CargoStatus {
  WAITING = 1,
  ONWAY,
  DONE,
}

interface Cargo {
  id: string;
  name: string;
  status: CargoStatus;
  origin: string;
  destination: string;
  departureDate: string;
}

const initialState: Cargo[] = [
  {
    id: "CARGO1",
    name: "Строительные материалы",
    status: CargoStatus.ONWAY,
    origin: "Москва",
    destination: "Казань",
    departureDate: "2024-11-24",
  },
  {
    id: "CARGO2",
    name: "Хрупкий груз",
    status: CargoStatus.WAITING,
    origin: "Санкт-Петербург",
    destination: "Екатеринбург",
    departureDate: "2024-11-26",
  },
];

const cargoListSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    addCargo(
      state,
      action: {
        payload: Cargo;
        type: string;
      }
    ) {
      state.push(action.payload);
    },
    changeStatus(
      state,
      action: {
        payload: { cargoStatus: CargoStatus; cargoId: string };
        type: string;
      }
    ) {
      state.forEach((cargo) => {
        if (cargo.id === action.payload.cargoId) {
          cargo.status = action.payload.cargoStatus;
        }
      });
    },
  },
});

export const { addCargo, changeStatus } = cargoListSlice.actions;

export default cargoListSlice.reducer;
