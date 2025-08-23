export type TUser = {
  id: string;
  role: "nollan" | "fadder" | "ansvarig" | "phöz" | null;
  teamId: number | null;
  username: string | null;
};

export type TTeam = {
  id: number;
  teamName: string;
  mainColor: string;
  secondaryColor: string;
};

export type TCoupon = {
  id: number;
  couponWorth: number | null;
  couponCode: string;
  exported: boolean | null;
};
