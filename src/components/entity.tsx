import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import GridView from "./grid-view";
import { GridEntity } from "interfaces";
import dataServices from "../services/data";
import { api } from "services";
import { Modal } from "semantic-ui-react";
interface EntityProps {
  value: any;
  values?: any[];
  onChange: Function;
  disabled?: boolean;
  gridName: string;
  multiple?: boolean;
  displayField?: string;
  value_field?: string;
}
function Entity({
  value,
  values,
  onChange,
  disabled,
  gridName,
  multiple,
  displayField,
  value_field,
}: EntityProps): React.ReactElement {
  const gridInfo: GridEntity = useMemo<GridEntity>(() => {
    let rs: GridEntity = dataServices.getGrid(gridName);
    return rs;
  }, [gridName]);
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    if (items.length) return;
    async function loadItems(ids: number[]) {
      let postfn = api.post;
      let rs = [];
      if(value_field) {
        rs = await postfn(gridInfo.api, { where: { [value_field]: ids } });
      } else {
        rs = await postfn(gridInfo.api, { where: { id: ids } });
      }
      setItems(rs.data);
    }
    if (multiple) {
      if (values && values.length) {
        loadItems(values);
      } else {
        setItems([]);
      }
    } else {
      if (value) {
        loadItems([value]);
      }
    }
  }, [value, values]);
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  function updateChange(newItems: any) {
    if (multiple) {
      onChange(
        newItems.map((i: any) => i.id),
        newItems
      );
    } else {
      onChange(newItems[0]?.id || null, newItems[0]);
    }
  }
  function renderValue(): React.ReactElement {
    if (multiple) {
      if (items && items.length) {
        return (
          <p>
            {items.map((i, index) => (
              <span key={index} className="inline-block pt-2">
                <span className="bg-gray-200 text-gray-800 p-1 rounded-sm text-sm">
                  {i[displayField]}
                </span>
                <span
                  onClick={(evt: React.MouseEvent<HTMLElement>) => {
                    evt.stopPropagation();
                    setItems(items.filter((it) => it.id !== i.id));
                  }}
                  className="bg-gray-300 p-1 px-2 rounded-r-sm hover:text-red-700 text-sm mr-2"
                >
                  <i className="fas fa-times" />
                </span>{" "}
              </span>
            ))}
          </p>
        );
      } else {
        return <p className="text-gray-400 pt-2">{t("Select")}</p>;
      }
    } else {
      return (
        <p className="pt-2">
          {items[0] ? items[0][displayField] : t("Select")}
        </p>
      );
    }
  }
  return (
    <>
      <Modal
        closeIcon={true}
        open={showModal}
        header={t("Select")}
        onClose={() => {
          setShowModal(false);
        }}
        size="small"
      >
        <GridView
          gridName={gridName}
          canSelect
          disableButton
          selectedItems={items}
          onItemSelected={(item: any) => {
            if (multiple) {
              let exists = items.find((i) => i.id === item.id);
              let newItems = [];
              if (exists) {
                newItems = items.filter((i) => i.id !== item.id);
              } else {
                newItems = [...items];
                newItems.push(item);
              }
              setItems(newItems);
              updateChange(newItems);
            } else {
              if (items.length > 0 && items[0].id === item.id) {
                setItems([]);
                updateChange([]);
                // setShowModal(false);
              } else {
                setItems([item]);
                updateChange([item]);
                // setShowModal(false);
              }
            }
          }}
          onChangeSelectedItems={(val: any[]) => {
            setItems(val);
            updateChange(val);
            if (!multiple) {
              setShowModal(false);
            }
          }}
        />
      </Modal>
      <div className="flex w-full">
        <button
          type="button"
          style={{ minHeight: "2.5rem", borderRadius: ".28571429rem" }}
          onClick={() => {
            setShowModal(true);
          }}
          className="placeholder-blueGray-300 text-blueGray relative bg-white rounded-sm shadow outline-none active:outline-none active:ring-1 focus:ring-1 ring-primary-600 pb-2 w-full px-3 border text-left"
        >
          {renderValue()}
        </button>
        <button
          onClick={() => {
            updateChange([]);
            setItems([]);
          }}
          type="button"
          style={{ borderRadius: ".28571429rem" }}
          className="py-2 px-4 border border-l-0 shadow active:ring-1 focus:ring-1 ring-primary-600"
        >
          <i className="fas fa-times" />
        </button>
      </div>
    </>
  );
}
export default Entity;
