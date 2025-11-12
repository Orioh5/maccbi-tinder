import localFont from "next/font/local";

const fbPractica = localFont({
  src: [
    {
      path: "../../fonts/FbPractica-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../fonts/FbPractica-Light 2.otf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../fonts/FbPractica-Bold.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-fb-practica",
  display: "swap",
});

export { fbPractica };
