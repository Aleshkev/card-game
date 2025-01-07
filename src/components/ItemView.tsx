import { motion } from "motion/react";
import { Item } from "../types/item";
import { ItemFrontSideGraphic } from "./ItemFrontSideGraphic";

export type Props = {
  item: Item;
  onClick?: () => void;
};

export function ItemView({ item, onClick }: Props) {
  return (
    <motion.div
      layout
      layoutId={`layoutId_item_${item.id}`}
      className="drop-shadow-lg cursor-pointer"
      onTap={onClick}
      whileHover={onClick && { translateY: -20, translateX: -20, scale: 1.05 }}
    >
      <ItemFrontSideGraphic item={item} />
    </motion.div>
  );
}
