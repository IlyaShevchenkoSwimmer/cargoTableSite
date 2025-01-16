import store from "./store";
import { RootState } from "./store";
import { changeStatus } from "./store/cargoListSlice";

const cargoList = document.getElementById("cargoList");

function createCargoList(state: RootState, list: HTMLElement) {
  list.innerHTML = `<tbody>${state.list.map((cargo) => {
    return `
    <tr>
    <td>
    <article>
    <h2>${cargo.name}</h2> <span>${cargo.id}</span>
    <span>Откуда: ${cargo.origin}</span><span>Куда: ${cargo.destination}</span>
      <span>Дата отправления: ${cargo.departureDate}</span>
      <select id="${cargo.id}" name="${cargo.id}">
      <option value="1" ${
        cargo.status === 1 ? "selected" : ""
      }>Ожидает отправки</option>
        <option value="2" ${
          cargo.status === 2 ? "selected" : ""
        }>В пути</option>
          <option value="3" ${
            cargo.status === 3 ? "selected" : ""
          }>Доставлен</option>
            </select>
            </article>
            </td>
            </tr>`;
  })}
          </tbody>`;

  const statusSelect = document.querySelectorAll("select");

  statusSelect.forEach((cargo) => {
    (cargo as HTMLSelectElement).onchange = statusChange;
  });
}

createCargoList(store.getState(), cargoList as HTMLElement);

function statusChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  store.dispatch(
    changeStatus({ cargoStatus: Number(target.value), cargoId: target.id })
  );
  createCargoList(store.getState(), cargoList as HTMLElement);
}

function submitForm(event: Event) {
  event.preventDefault();
  const id = "CARGO" + store.getState().list.length + 1;
  const date = document.getElementById("date") as HTMLInputElement;
  const cargoName = document.getElementById("cargoName") as HTMLInputElement;
  if (date.value === "") {
    alert("Введите корректную дату!");
  }
  if (cargoName.value.length < 3) {
    alert("Введите корректное название!");
  }
}

const submit = document.getElementById("submitForm") as HTMLElement;

submit.onclick = submitForm;
