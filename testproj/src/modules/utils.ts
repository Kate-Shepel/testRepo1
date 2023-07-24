export default function clearBody(): void {
  document.body.innerHTML = "";
}

const carBrand = [
  "BMW",
  "Bugatti",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ferrari",
  "Fiat",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Jaguar",
  "Lamborghini",
  "Lexus",
  "Maserati",
  "Mitsubishi",
  "Smart",
  "Suzuki",
];
const carModel = [
  "Outlander",
  "Armada",
  "CX-90",
  "RZ",
  "Huracan",
  "QX80",
  "Santa Cruz",
  "Accord",
  "Civic",
  "GV60",
  "G90",
  "F-150",
  "500X",
  "Charger",
  "Challenger",
  "Pacifica",
  "Silverado",
  "Escalade",
  "Chiron",
];

const carColor = [
  "#7FFF00",
  "#6495ED",
  "#DC143C",
  "#008B8B",
  "#9932CC",
  "#FF8C00",
  "#8B0000",
  "#00CED1",
  "#FF1493",
  "#4B0082",
  "#F0E68C",
  "#E6E6FA",
  "#ADD8E6",
  "#F08080",
  "#FFA07A",
  "#66CDAA",
  "#0000CD",
  "#008080",
  "#D2B48C",
  "#2F4F4F",
  "#FFD700",
  "#F0E68C",
  "#FFFACD",
  "#800000",
];

export function generateCarName(): string {
  const randomBrandIndex = Math.floor(Math.random() * carBrand.length);
  const randomModelIndex = Math.floor(Math.random() * carModel.length);

  return `${carBrand[randomBrandIndex]} ${carModel[randomModelIndex]}`;
}

export function generateCarColor(): string {
  const randomColorIndex = Math.floor(Math.random() * carColor.length);

  return `${carColor[randomColorIndex]}`;
}

export const generateCars = (count = 100) =>
  new Array(count)
    .fill(1)
    .map(() => ({ name: generateCarName(), color: generateCarColor() }));
