const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const edoFont = new FontFace("myEdoFont", "url(./assets/edo.ttf)");
edoFont.load().then(function (font) {
  // with canvas, if this is ommited won't work
  document.fonts.add(font);
});

const baseImage = new Image();
baseImage.src = "./bolsonaro22.png";

document
  .querySelector("button[name=save]")
  .addEventListener("click", saveImage);
document
  .querySelector("button[name=share]")
  .addEventListener("click", shareImage);

async function shareImage() {
  canvas.toBlob((blob) => {
    const filesArray = [
      new File([blob], document.querySelector("input").value.trim(), {
        type: "image/jpeg",
        lastModified: new Date().getTime(),
      }),
    ];
    const shareData = {
      files: filesArray,
    };
    navigator.share(shareData);
  });
}

function saveImage() {
  const a = document.createElement("a");
  a.setAttribute("href", canvas.toDataURL("image/png"));
  a.setAttribute("download", document.querySelector("input").value.trim());
  a.click();
}

document
  .querySelector("input[name=yourname]")
  .addEventListener("keyup", (ev) => {
    ev.preventDefault();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(baseImage, 0, 0);

    context.save();

    context.translate(400, 230);
    context.rotate((-5 * Math.PI) / 180);

    context.textBaseline = "middle";
    context.font = "65px myEdoFont";

    const width = context.measureText(
      document.querySelector("input").value.trim()
    ).width;

    context.fillStyle = "white";
    context.fillText(
      document
        .querySelector("input")
        .value.trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""),
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
