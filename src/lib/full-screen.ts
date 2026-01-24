const playerFullScreen = () => {
  const player = document.getElementById("media-info");
  if (!player) return;

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else if (player.requestFullscreen) {
    player.requestFullscreen().catch(() => {});
  }
};

const assetFullScreen = () => {
  const assetView = document.getElementById("asset-view");
  if (!assetView) return;

  if (document.fullscreenElement) {
    document.exitFullscreen().catch(() => {});
  } else if (assetView.requestFullscreen) {
    assetView.requestFullscreen().catch(() => {});
  }
};

export { playerFullScreen, assetFullScreen };
