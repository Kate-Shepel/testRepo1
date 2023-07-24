import Api from "./apiRequests";

const { items: cars, count: carsTotal } = await Api.getCars(1);
const { items: winners, count: winnersTotal } = await Api.getWinners({
  page: 1,
});

const storage = {
  cars,
  carsTotal,
  carsPage: 1,
  winners,
  winnersTotal,
  winnersPage: 1,
  inputValues: {
    createName: "",
    createColor: "#f4fc5b",
    updateName: "",
    updateColor: "#f4fc5b",
    updateNameDisabled: true,
    updateColorDisabled: true,
  },
};

export default storage;
