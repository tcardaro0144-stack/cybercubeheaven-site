/* Download and media config. Replace TODO values only. */

const FULL_GAME_URL = "TODO";
const FULL_GAME_SIZE = "74 MB";
const DEMO_URL = "TODO";
const DEMO_SIZE = "248 MB";
const ITCH_URL = "TODO";
const GITHUB_URL = "https://github.com/tcardaro0144-stack/cybercubeheaven-site";

/* "Free" or "Paid, $X". Omitted from the page while this is TODO. */
const PRICE = "TODO";

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
    play.hidden = false;
    if (reduce) {
      video.pause();
      play.textContent = "Play clip";
      play.setAttribute("aria-pressed", "false");
      return;
    }
    const pending = video.play();
    if (pending && typeof pending.catch === "function") {
      pending.then(function () {
        play.textContent = "Pause clip";
        play.setAttribute("aria-pressed", "true");
      }).catch(function () {
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
