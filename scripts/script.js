const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const pantonFont = new FontFace(
  "myPantonFont",
  "url(./assets/panton-extrabold.otf)"
);
pantonFont.load().then(function (font) {
  // with canvas, if this is ommited won't work
  document.fonts.add(font);
});

const baseImage = new Image();
baseImage.src = "./apoioBolsonaro22.png";

document.getElementById("btnShare").addEventListener("click", shareImage);
document.getElementById("btnSave").addEventListener("click", saveImage);

function roundRect(ctx, x, y, width, height, radius = 5) {
  if (typeof radius === "number") {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { ...{ tl: 0, tr: 0, br: 0, bl: 0 }, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(
    x + width,
    y + height,
    x + width - radius.br,
    y + height
  );
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  ctx.fill();
}

async function shareImage() {
  try {
    gtag("event", "share");

    canvas.toBlob((blob) => {
      const filesArray = [
        new File(
          [blob],
          document.querySelector("input").value.trim() + ".jpg",
          {
            type: "image/jpeg",
            lastModified: new Date().getTime(),
          }
        ),
      ];
      const shareData = { files: filesArray };

      navigator.share(shareData);
    });
  } catch (error) {
    gtag("event", "exception", {
      description: "[fn:shareImage] " + (error.message || error),
      fatal: false,
    });
    Alert(
      "Não foi possível compartilhar a imagem: " + (error.message || error)
    );
  }
}

function saveImage() {
  try {
    gtag("event", "download");

    const a = document.createElement("a");
    a.setAttribute("href", canvas.toDataURL("image/png"));
    a.setAttribute("download", document.querySelector("input").value.trim());
    a.click();
  } catch (error) {
    gtag("event", "exception", {
      description: "[fn:saveImage] " + (error.message || error),
      fatal: false,
    });
    Alert("Não foi possível baixar a imagem: " + (error.message || error));
  }
}

document
  .querySelector("input[name=yourname]")
  .addEventListener("keyup", (ev) => {
    ev.preventDefault();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(baseImage, 0, 0);

    context.save();

    context.translate(1080 / 2, 335);
    context.rotate((-6.81 * Math.PI) / 180);

    context.textBaseline = "middle";
    context.font = "125px myPantonFont";

    const width = context.measureText(
      document.querySelector("input").value.trim()
    ).width;

    context.fillStyle = "#0c67ce";
    roundRect(context, -width / 2 - 45, -175 / 2, width + 45 * 2, 175, 21.66);

    context.fillStyle = "white";
    context.fillText(
      document.querySelector("input").value.trim(),
      -width / 2,
      0
    );

    context.restore();
  });

window.onload = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(baseImage, 0, 0);

  context.save();
};
