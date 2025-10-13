function afterVisualUpdate(callback, useExtraFrame) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (useExtraFrame) {
          requestAnimationFrame(() => {
            callback?.();
            resolve();
          });
        } else {
          callback?.();
          resolve();
        }
      });
    });
  });
}

export default afterVisualUpdate;
