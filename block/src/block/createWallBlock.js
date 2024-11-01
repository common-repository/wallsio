import { createBlock } from "@wordpress/blocks";
import { initialWallUrl } from "../../../shared/WallUrl";

export default function createWallBlock(wallIdentifier) {
  const wallUrl = initialWallUrl(wallIdentifier);
  return createBlock("wallsio/wallsio", { wallUrl });
}
