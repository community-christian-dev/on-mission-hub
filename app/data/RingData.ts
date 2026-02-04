export type RingType = {
  borderColor: string;
  id: string;
  radius: number;
  itemColor: string;
  startAngle: number;
  bgColor: string;
  name: string;
};

export const RingData: RingType[] = [
  {
    id: "center",
    radius: 50,
    borderColor: "border-yellow-500/50",
    itemColor: "bg-yellow-600",
    startAngle: 0,
    bgColor: "bg-yellow-600/10",
    name: "My One",
  },
  {
    id: "friends",
    radius: 100,
    borderColor: "border-blue-500/50",
    itemColor: "bg-blue-600",
    startAngle: 45,
    bgColor: "bg-blue-600/10",
    name: "Friends",
  },
  {
    id: "acquaintances",
    radius: 150,
    borderColor: "border-teal-500/50",
    itemColor: "bg-teal-600",
    startAngle: 120,
    bgColor: "bg-teal-600/10",
    name: "Acquaintances",
  },
  {
    id: "strangers",
    radius: 200,
    borderColor: "border-purple-500/50",
    itemColor: "bg-purple-600",
    startAngle: 200,
    bgColor: "bg-purple-600/10",
    name: "Strangers",
  },
  {
    id: "places",
    radius: 250,
    borderColor: "border-orange-500/50",
    itemColor: "bg-orange-600",
    startAngle: 300,
    bgColor: "bg-orange-600/10",
    name: "Places",
  },
];
