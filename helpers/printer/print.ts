import EscPosPrinter, {
  getPrinterSeriesByName,
} from "react-native-esc-pos-printer";
import moment from "moment";

export async function testPrint(orderList: any) {
  if(orderList?.length > 0) {
    await EscPosPrinter.init({
      target: "BT:00:01:90:56:EB:70",
      seriesName: getPrinterSeriesByName("TM-m30"),
      language: "EPOS2_LANG_EN",
    });
    const printing = new EscPosPrinter.printing();
    let status = await printing.initialize();
    let statusx;
    for (const order of orderList) {
      statusx = await printOrder(order, status);
    }
    statusx.send();
  }

}

const printOrder = async (order, status) => {
  try {

    const orderIdSplit = order.orderId.split("-");
    const idPart1 = orderIdSplit[0];
    const idPart2 = orderIdSplit[2];

    status
      .align("center")
      .size(3, 3)
      .image(require("../../assets/output-onlinepngtools.png"), {
        width: 500,
        halftone: "EPOS2_HALFTONE_THRESHOLD",
      })
      .smooth(false);
    status.align("center")
    .image({ uri: order.customerDetails.recipetName }, { width: 600 });
    status
    .size(2, 2)
    .text(order.customerDetails.phone)
    .newline(3)
      .size(2, 2)
      .text(
        `${moment(order.created).format("HH:mm DD/MM")} ${"מועד קבלה:"
          .split("")
          .reverse()
          .join("")}`
      )
      .newline(2)
      .size(2, 2)
      .text(`מספר הזמנה: ${idPart1}-${idPart2}`.split("").reverse().join(""))
      .newline(2);
    if (order.orderDate) {
      status
        .size(2, 2)
        .text(
          `${moment(order.orderDate).format(
            "HH:mm DD/MM"
          )} ${"מועד מסירה:".split("").reverse().join("")}`
        );
    }
    status.newline(4).size(2, 2);
    order.order.items.forEach((order) => {
      status.textLine(48, {
        left: `₪${order.price * order.qty}`,
        right: `X${order.qty} ` + `${order.name}`.split("").reverse().join(""),
        gapSymbol: ".",
      });
      status.newline(4);
    });
    status.size(2, 2);
    status.text(
      `₪${order.total} ${"סה״כ לתשלום:".split("").reverse().join("")}`
    );
    status.newline(2);
    status.newline(3).align("center");
    if (order.order.geo_positioning) {
      status
        .size(1, 1)
        .text("סרוק כתובת".split("").reverse().join(""))
        .newline()
        .qrcode({
          value: `https://www.waze.com/ul?ll=${order.order.geo_positioning.latitude},${order.order.geo_positioning.longitude}&navigate=yes&zoom=17`,
          level: "EPOS2_LEVEL_M",
          width: 5,
        })
        .newline(2);
    }
    status
      .newline()
      .image(require("../../assets/copyright-logo.png"), {
        width: 250,
        halftone: "EPOS2_HALFTONE_THRESHOLD",
      })
      .newline(3)
      .cut();

    console.log("Success:", status);
    return status;

  } catch (e) {
    console.log("Error:", e);
  }
};
