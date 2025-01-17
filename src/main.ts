import store from "./store";
import { RootState } from "./store";
import { addCargo, changeStatus } from "./store/cargoListSlice";
import { changeForm } from "./store/formSlice";

const cargoList = document.getElementById("cargoList");

function createCargoList(state: RootState, list: HTMLElement, filter = 0) {
  list.innerHTML = "";
  state.list.map((cargo) => {
    list.innerHTML += `
    <tr ${
      filter === 0 ? "" : cargo.status === filter ? "" : "hidden"
    } style="width: 60%;">
    <td style="padding: 0; border: none" class="rounded">
    <article class="card d-flex justify-content-center p-3 border border-3 ${
      cargo.status === 1
        ? "bg-warning"
        : cargo.status === 2
        ? "bg-primary"
        : "bg-success"
    }">
    <h2>${cargo.name}</h2> <span style="color: grey">${cargo.id}</span>
    <span>Откуда: ${cargo.origin}</span><span>Куда: ${cargo.destination}</span>
      <span>Дата отправления: ${cargo.departureDate}</span>
      <select id="${cargo.id}" name="${
      cargo.id
    }" class="cargoSelect form-select">
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
            </tr><tr style="height: 20px; border: none;"></tr>`;
  });

  const statusSelect = document.querySelectorAll(".cargoSelect");

  statusSelect.forEach((cargo) => {
    (cargo as HTMLSelectElement).onchange = statusChange;
  });
}

createCargoList(store.getState(), cargoList as HTMLElement);

function statusChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  const today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  if (dd.length === 1) {
    dd = "0" + dd;
  }
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  if (mm.length === 1) {
    mm = "0" + mm;
  }
  const yyyy = today.getFullYear();
  const neededCargoDate = store.getState().list.find((cargo) => {
    return cargo.id === target.id;
  })?.departureDate;
  const cargoYear = neededCargoDate?.slice(0, 4);
  const cargoMonth = neededCargoDate?.slice(5, 7);
  const cargoDay = neededCargoDate?.slice(8, 10);

  // check for departureDate and actual date before changing status
  if (target.value === "1" || target.value === "2") {
    store.dispatch(
      changeStatus({
        cargoStatus: Number(target.value),
        cargoId: target.id,
      })
    );
    const filter = (document.getElementById("filter") as HTMLSelectElement)
      .value;
    createCargoList(store.getState(), cargoList as HTMLElement, Number(filter));
  } else {
    if (Number(cargoYear) > Number(yyyy)) {
      alert("Товар не мог опередить время!");
      createCargoList(store.getState(), cargoList as HTMLElement);
    } else if (Number(cargoYear) === Number(yyyy)) {
      if (Number(cargoMonth) > Number(mm)) {
        alert("Товар не мог опередить время!");
        createCargoList(store.getState(), cargoList as HTMLElement);
      } else if (Number(cargoMonth) === Number(mm)) {
        if (Number(cargoDay) > Number(dd)) {
          alert("Товар не мог опередить время!");
          createCargoList(store.getState(), cargoList as HTMLElement);
        } else if (Number(cargoDay) === Number(dd)) {
          store.dispatch(
            changeStatus({
              cargoStatus: Number(target.value),
              cargoId: target.id,
            })
          );
          const filter = (
            document.getElementById("filter") as HTMLSelectElement
          ).value;
          createCargoList(
            store.getState(),
            cargoList as HTMLElement,
            Number(filter)
          );
        } else {
          store.dispatch(
            changeStatus({
              cargoStatus: Number(target.value),
              cargoId: target.id,
            })
          );
          const filter = (
            document.getElementById("filter") as HTMLSelectElement
          ).value;
          createCargoList(
            store.getState(),
            cargoList as HTMLElement,
            Number(filter)
          );
        }
      } else {
        store.dispatch(
          changeStatus({
            cargoStatus: Number(target.value),
            cargoId: target.id,
          })
        );
        const filter = (document.getElementById("filter") as HTMLSelectElement)
          .value;
        createCargoList(
          store.getState(),
          cargoList as HTMLElement,
          Number(filter)
        );
      }
    } else {
      store.dispatch(
        changeStatus({
          cargoStatus: Number(target.value),
          cargoId: target.id,
        })
      );
      const filter = (document.getElementById("filter") as HTMLSelectElement)
        .value;
      createCargoList(
        store.getState(),
        cargoList as HTMLElement,
        Number(filter)
      );
    }
  }
}

function textChange(event: Event) {
  const target = event.target as HTMLInputElement;
  store.dispatch(changeForm({ ...store.getState().form, text: target.value }));
}

const cargoName = document.getElementById("cargoName") as HTMLInputElement;

cargoName.onkeydown = textChange;
cargoName.onchange = textChange;

function dateChange(event: Event) {
  const target = event.target as HTMLInputElement;
  store.dispatch(changeForm({ ...store.getState().form, date: target.value }));
}

const date = document.getElementById("date") as HTMLInputElement;

date.onchange = dateChange;

function submitForm(event: Event) {
  event.preventDefault();
  const id = "CARGO" + (store.getState().list.length + 1);
  const date = document.getElementById("date") as HTMLInputElement;
  const cargoName = document.getElementById("cargoName") as HTMLInputElement;
  const status = (document.getElementById("status") as HTMLSelectElement).value;
  const origin = document.getElementById("origin") as HTMLSelectElement;
  const destination = document.getElementById(
    "destination"
  ) as HTMLSelectElement;
  if (date.value === "") {
    alert("Введите корректную дату!");
  }
  if (cargoName.value.length < 3) {
    alert("Введите корректное название!");
  }

  if (date.value !== "" && cargoName.value.length >= 3) {
    store.dispatch(
      addCargo({
        id,
        name: cargoName.value,
        status: Number(status),
        origin: origin.options[origin.selectedIndex].text,
        destination: destination.options[destination.selectedIndex].text,
        departureDate: date.value,
      })
    );
    cargoName.value = "";
    createCargoList(store.getState(), cargoList as HTMLElement);
  }
}

const submit = document.getElementById("submitForm") as HTMLElement;

submit.onclick = submitForm;

function filterChange() {
  const filter = (document.getElementById("filter") as HTMLSelectElement).value;
  createCargoList(store.getState(), cargoList as HTMLElement, Number(filter));
}

const filter = document.getElementById("filter") as HTMLSelectElement;

filter.onchange = filterChange;
