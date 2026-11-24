import { useEffect, useState } from "react";

const MAX_PREVIEWS = 8;
const active = new Set();
const waiters = new Set();

function notify() {
  waiters.forEach((update) => update());
}

export function usePreviewSlot(id, enabled) {
  const [hasSlot, setHasSlot] = useState(false);

  useEffect(() => {
    if (!enabled) {
      if (active.delete(id)) notify();
      return undefined;
    }

    const update = () => {
      if (active.has(id)) {
        setHasSlot(true);
        return;
      }
      if (active.size < MAX_PREVIEWS) {
        active.add(id);
        setHasSlot(true);
        return;
      }
      setHasSlot(false);
    };

    waiters.add(update);
    update();

    return () => {
      waiters.delete(update);
      if (active.delete(id)) notify();
    };
  }, [id, enabled]);

  return enabled && hasSlot;
}
