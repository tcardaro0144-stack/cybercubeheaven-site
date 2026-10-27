/* Download and media config. Replace TODO values only. */

const FULL_GAME_URL = "https://tjc8951.itch.io/cyber-cube-heaven";
const FULL_GAME_SIZE = "74 MB";
const DEMO_URL = "https://tjc8951.itch.io/cyber-cube-heaven-demo";
const DEMO_SIZE = "247 MB";
const ITCH_URL = "https://tjc8951.itch.io/";
const GAMEJOLT_URL = "https://gamejolt.com/games/cyber-cube-heaven/1091141";
const GITHUB_URL = "https://github.com/tcardaro0144-stack/cybercubeheaven-site";

/* Demo is free. Full game is pay what you want on itch.io, and $4.99 on Game Jolt. */
const PRICE = "The demo is free. On itch.io the full game is pay what you want, including free. On Game Jolt it is $4.99.";

/* Drop files at these paths. Leave the strings as they are. */
const STAGE1_VIDEO = "assets/stage1.mp4";
const STAGE1_POSTER = "assets/stage1-poster.webp";
const STAGE2_VIDEO = "assets/stage2.mp4";
const STAGE2_POSTER = "assets/stage2-poster.webp";

function isPending(value) {
  return !value || value === "TODO";
}

function wireLink(anchor, url) {
  const status = anchor.querySelector(".btn-status");
  if (isPending(url)) {
    anchor.classList.add("is-unavailable");
    anchor.setAttribute("aria-disabled", "true");
    anchor.setAttribute("tabindex", "-1");
    anchor.removeAttribute("href");
    if (status) {
      status.hidden = false;
    }
    return;
  }

  anchor.classList.remove("is-unavailable");
  anchor.removeAttribute("aria-disabled");
  anchor.removeAttribute("tabindex");
  anchor.href = url;
  if (url.startsWith("http")) {
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
  }
  if (status) {
    status.hidden = true;
  }
}

function fillText(name, value) {
  document.querySelectorAll("[data-fill='" + name + "']").forEach(function (node) {
    node.textContent = value;
  });
}

function mountClip(root) {
  const video = root.querySelector("video");
  const play = root.querySelector(".clip-play");
  const videoPath = root.getAttribute("data-video");
  const posterPath = root.getAttribute("data-poster");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!video || isPending(videoPath)) {
    return;
  }

  function showReady() {
    root.classList.add("is-ready");
    if (reduce) {
      video.pause();
      play.hidden = false;
      play.textContent = "Play clip";
      play.setAttribute("aria-pressed", "false");
      return;
    }
    play.hidden = true;
    const pending = video.play();
    if (pending && typeof pending.catch === "function") {
      pending.catch(function () {
        play.hidden = false;
        play.textContent = "Play clip";
        play.setAttribute("aria-pressed", "false");
      });
    }
  }

  let failed = false;
  video.addEventListener("error", function () {
    if (failed) {
      return;
    }
    failed = true;
    root.classList.remove("is-ready");
    play.hidden = true;
    video.removeAttribute("src");
  });

  play.addEventListener("click", function () {
    if (video.paused) {
      video.play();
      play.textContent = "Pause clip";
      play.setAttribute("aria-pressed", "true");
    } else {
      video.pause();
      play.textContent = "Play clip";
      play.setAttribute("aria-pressed", "false");
    }
  });

  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.preload = "metadata";
  if (!isPending(posterPath)) {
    video.poster = posterPath;
  }
  video.addEventListener("loadeddata", showReady, { once: true });
  video.src = videoPath;
}

document.querySelectorAll("[data-link='full']").forEach(function (anchor) {
  wireLink(anchor, FULL_GAME_URL);
});
document.querySelectorAll("[data-link='demo']").forEach(function (anchor) {
  wireLink(anchor, DEMO_URL);
});
document.querySelectorAll("[data-link='itch']").forEach(function (anchor) {
  wireLink(anchor, ITCH_URL);
});
document.querySelectorAll("[data-link='gamejolt']").forEach(function (anchor) {
  wireLink(anchor, GAMEJOLT_URL);
});
document.querySelectorAll("[data-link='github']").forEach(function (anchor) {
  wireLink(anchor, GITHUB_URL);
});

fillText("full-size", FULL_GAME_SIZE);
fillText("demo-size", DEMO_SIZE);

const priceNode = document.querySelector("[data-price]");
if (priceNode && !isPending(PRICE)) {
  fillText("price", PRICE);
  priceNode.hidden = false;
}

document.querySelectorAll(".clip").forEach(function (root) {
  const which = root.getAttribute("data-clip");
  if (which === "stage1") {
    root.setAttribute("data-video", STAGE1_VIDEO);
    root.setAttribute("data-poster", STAGE1_POSTER);
  } else if (which === "stage2") {
    root.setAttribute("data-video", STAGE2_VIDEO);
    root.setAttribute("data-poster", STAGE2_POSTER);
  }
  mountClip(root);
});
