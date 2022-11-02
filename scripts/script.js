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

const $main = document.querySelector("#main");
const $menu = document.querySelector("#menu");

let menuSelecionado = "";
function optionMenu() {
  return menuSelecionado;
}

const baseImageFigure = new Image();
baseImageFigure.src = "./apoioaobrasil.png?v=2";

const baseImageFiltro = new Image();
baseImageFiltro.src = "./bannerInicialBrasil.png?v=2";

const baseImageMascara = new Image();
baseImageMascara.src = "./mascaraBrasil.png?v=2";

let baseImageUsuario = new Image();

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

    if (optionMenu() === "figura") {
      arquivoName = document.querySelector("input[name=yourname]").value.trim();
    } else if (optionMenu() === "filtro") {
      arquivoName = "apoio";
    }

    const a = document.createElement("a");
    a.setAttribute("href", canvas.toDataURL("image/png"));
    a.setAttribute("download", arquivoName);
    a.click();
  } catch (error) {
    gtag("event", "exception", {
      description: "[fn:saveImage] " + (error.message || error),
      fatal: false,
    });
    Alert("Não foi possível baixar a imagem: " + (error.message || error));
  }
}

function clickNome() {
  menuSelecionado = "figura";
  changeMenu();
}

function clickFoto() {
  menuSelecionado = "filtro";
  changeMenu();
}
function clickVoltar() {
  menuSelecionado = "";

  $menu.classList.remove("hidden");
  $main.classList.add("hidden");
}

function changeMenu() {
  baseImageUsuario = new Image();
  context.clearRect(0, 0, canvas.width, canvas.height);
  $menu.classList.add("hidden");
  $main.classList.remove("hidden");

  switch (optionMenu()) {
    case "figura":
      document.querySelector("input[name=yourname]").type = "text";
      drawArte();
      break;
    case "filtro":
      document.querySelector("input[name=yourname]").type = "file";
      drawArte();
      break;
  }
}

function drawArte() {
  const content = document.querySelector("input[name=yourname]").value.trim();

  if (optionMenu() === "figura") {
    context.drawImage(baseImageFigure, 0, 0);
  } else if (optionMenu() === "filtro") {
    if (baseImageUsuario.src) {
      context.drawImage(baseImageMascara, 0, 0, 1080, 1080);
    } else {
      context.drawImage(baseImageFiltro, 0, 0, 1080, 1080);
    }
  }

  context.save();

  if (optionMenu() === "figura" && content) {
    context.translate(1080 / 2, 335);
    context.rotate((-6.81 * Math.PI) / 180);

    context.textBaseline = "middle";
    context.font = "125px myPantonFont";

    const width = context.measureText(content).width;

    context.fillStyle = "#0c67ce";
    roundRect(context, -width / 2 - 45, -175 / 2, width + 45 * 2, 175, 21.66);

    context.fillStyle = "white";
    context.fillText(content, -width / 2, 0);
  }

  context.restore();
}

document
  .querySelector("input[name=yourname]")
  .addEventListener("keyup", (ev) => {
    ev.preventDefault();

    drawArte();
  });

document
  .querySelector("input[name=yourname]")
  .addEventListener("change", (ev) => {
    ev.preventDefault();

    if (ev.target.files && ev.target.files[0]) {
      const reader = new FileReader();

      reader.onload = (ev) => {
        baseImageUsuario = new Image();
        context.clearRect(0, 0, canvas.width, canvas.height);
        baseImageUsuario.src = ev.target.result;

        baseImageUsuario.addEventListener("load", () => {
          const oldWidth = baseImageUsuario.width;
          baseImageUsuario.width = 1080;
          baseImageUsuario.height = (1080 / oldWidth) * baseImageUsuario.height;
          if (baseImageUsuario.height < 1080) {
            const oldHeight = baseImageUsuario.height;
            baseImageUsuario.height = 1080;
            baseImageUsuario.width =
              (1080 / oldHeight) * baseImageUsuario.width;
          }
          context.drawImage(
            baseImageUsuario,
            0 - (baseImageUsuario.width - 1080) / 2,
            0 - (baseImageUsuario.height - 1080) / 2,
            baseImageUsuario.width,
            baseImageUsuario.height
          );

          drawArte();
        });
      };
      reader.readAsDataURL(ev.target.files[0]);
    }
  });

window.onload = () => {
  drawArte();
};
