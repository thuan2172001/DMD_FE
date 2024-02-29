import { GridView } from "components";
import _ from "lodash";
import { useState } from "react";
import { useParams } from "react-router-dom";

export default function List() {
  const { name } = useParams();
  const [selectedItems, setSelectedItems] = useState([]);

  function pushOrRemoveItemFromArray(array: any[], item: any) {
    const index = array.indexOf(item);

    if (index === -1) {
      array.push(item);
    } else {
      array.splice(index, 1);
    }
    return array;
  }

  return (
    <GridView
      gridName={name}
      canSelect={true}
      selectedItems={selectedItems}
      onItemSelected={(item: any) => {
        let deepClone = _.cloneDeep(selectedItems);
        let newArr = pushOrRemoveItemFromArray(deepClone, item);
        setSelectedItems(newArr);
      }}
      resetSelectedItems={() => setSelectedItems([])}
    />
  );
}
