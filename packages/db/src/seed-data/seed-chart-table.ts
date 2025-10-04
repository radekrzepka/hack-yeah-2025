import type { ChartTableInsert } from "../schema";

export const SEED_CHARTS: Array<ChartTableInsert> = [
  {
    chartName: "Średnie miesięczne emerytury według rodzaju (2023)",
    chartType: "bar",
    chartData: {
      labels: [
        "Emerytury ogółem",
        "Emerytura",
        "Renta z tyt. niezdolności do pracy",
        "Renta rodzinna",
      ],
      datasets: [
        {
          label: "Średnia kwota (PLN)",
          data: [3270.23, 3389.49, 2621.97, 2949.33],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(153, 102, 255, 0.6)",
            "rgba(255, 159, 64, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
        },
      ],
    },
    source:
      "https://lang.zus.pl/benefits/general-information-about-old-age-pensions-and-other-pensions-from-fus",
  },
  {
    chartName: "Wskaźniki waloryzacji emerytur (2020-2025)",
    chartType: "line",
    chartData: {
      labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
      datasets: [
        {
          label: "Wskaźnik waloryzacji (%)",
          data: [3.56, 4.24, 7.0, 14.8, 12.3, 5.5],
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          fill: true,
        },
      ],
    },
    source:
      "https://www.gov.pl/web/rodzina/waloryzacja-rent-i-emerytur-w-2025-roku--wzrost-swiadczen-dla-milionow-polakow and historical data from ZUS",
  },
  {
    chartName: "Wzrost średniej emerytury (2020-2025)",
    chartType: "line",
    chartData: {
      labels: ["2020", "2021", "2022", "2023", "2024", "2025"],
      datasets: [
        {
          label: "Średnia kwota (PLN)",
          data: [2647, 2759, 2952, 3389, 3807, 4017],
          borderColor: "rgba(153, 102, 255, 1)",
          backgroundColor: "rgba(153, 102, 255, 0.2)",
          fill: true,
        },
      ],
    },
    source:
      "Calculated based on ZUS data and indexation rates from https://lang.zus.pl/",
  },
  {
    chartName: "Stopy zastąpienia brutto według poziomu zarobków",
    chartType: "bar",
    chartData: {
      labels: [
        "0,5x śr. wynagrodzenia",
        "Średnie wynagrodzenie",
        "2x śr. wynagrodzenia",
      ],
      datasets: [
        {
          label: "Stopa zastąpienia (%)",
          data: [30.3, 29.3, 28.7],
          backgroundColor: [
            "rgba(255, 206, 86, 0.6)",
            "rgba(54, 162, 235, 0.6)",
            "rgba(255, 99, 132, 0.6)",
          ],
        },
      ],
    },
    source:
      "OECD Pensions at a Glance 2023: https://www.oecd.org/content/dam/oecd/en/publications/reports/2024/10/pensions-at-a-glance-2023-country-notes_2e11a061/poland_babdea66/4bbbf273-en.pdf",
  },
  {
    chartName: "Wydatki na publiczne emerytury jako % PKB (projekcje)",
    chartType: "line",
    chartData: {
      labels: ["2022", "2028", "2070"],
      datasets: [
        {
          label: "% PKB",
          data: [10.2, 11.4, 10.1],
          borderColor: "rgba(255, 159, 64, 1)",
          backgroundColor: "rgba(255, 159, 64, 0.2)",
          fill: true,
        },
      ],
    },
    source:
      "IMF and EU Ageing Report: https://www.elibrary.imf.org/downloadpdf/view/journals/002/2025/007/article-A002-en.pdf",
  },
  {
    chartName: "Wzrost emerytury minimalnej (2017-2025)",
    chartType: "line",
    chartData: {
      labels: ["2017", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
      datasets: [
        {
          label: "Emerytura minimalna (PLN)",
          data: [1000, 1100, 1200, 1250.88, 1338.44, 1588.44, 1780.96, 1878.91],
          borderColor: "rgba(54, 162, 235, 1)",
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          fill: true,
        },
      ],
    },
    source:
      "ZUS and Government data: https://progressholding.pl/en/pension-in-poland-2025-requirements-age-amounts/",
  },
  {
    chartName: "Liczba emerytów (2015-2023)",
    chartType: "bar",
    chartData: {
      labels: ["2020", "2023"],
      datasets: [
        {
          label: "Liczba emerytów (w milionach)",
          data: [6, 7.9],
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    },
    source:
      "ZUS statistics: https://lang.zus.pl/benefits/general-information-about-old-age-pensions-and-other-pensions-from-fus",
  },
];
