import Image from "next/image";
import React from "react";
import { InventoryItem } from "./Grid";

interface IInventory {
  inventoryList: InventoryItem[];
  setSelectedItem: (val: InventoryItem) => void;
}

const InventoryItem: React.FC<{
  item: InventoryItem;
  onItemClick: (item: InventoryItem) => void;
  i: number;
}> = ({ item, onItemClick, i }) => {
  // console.log("item", item);

  return (
    <button
      onClick={() => {
        console.log("inventoryitem", item);
        onItemClick(item);
      }}
      className="w-full h-full flex items-center justify-center border p-2 "
    >
      <Image
        // src={`/${item}.svg`}
        src={
          i === 0
            ? "/assets/mirror-bottom-right.jpg"
            : "/assets/mirror-bottom-left.jpg"
        }
        alt={item.type.toString()}
        className=""
        width={48}
        height={48}
      />
    </button>
  );
};

const Inventory: React.FC<IInventory> = ({
  inventoryList,
  setSelectedItem,
}) => {
  const handleInventoryItemClick = (item: InventoryItem) => {
    console.log("handle", item);

    setSelectedItem(item);
  };
  return (
    <div className="grid grid-cols-2 p-2 rounded-sm grid-rows-5 w-48 h-[400px] bg-slate-400">
      {inventoryList.map((item, index) => {
        return (
          <InventoryItem
            key={item.id}
            i={index}
            onItemClick={handleInventoryItemClick}
            item={item}
          />
        );
      })}
    </div>
  );
};

export default Inventory;
