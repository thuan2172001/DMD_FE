import { EnumEntity } from "interfaces";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Checkbox, Icon } from "semantic-ui-react";
import dataService from "../services/data";
enum ItemState {
  Uncheck,
  Check,
  Indeterminate,
}
export default function Tree({
  value,
  onChange,
  viewOnly,
}: {
  value?: number[];
  onChange: Function;
  viewOnly?: boolean;
}): React.ReactElement {
  const [data, setData] = useState<any>([]);
  const [open, setOpen] = useState<any>([]);
  useEffect(() => {
    let rs: EnumEntity = dataService.getEnum("admin-permission-tree");
    let tmp = _.cloneDeep(rs.items);
    tmp.forEach((i: any) => {
      let checkCount = 0;
      if (i.children && i.children.length) {
        i.children.forEach((j: any) => {
          if (value && value.includes(j.value)) {
            j.state = ItemState.Check;
            checkCount++;
          }
        });
      }
      if (checkCount === 0) {
        i.state = ItemState.Uncheck;
      } else if (checkCount === i.children.length) {
        i.state = ItemState.Check;
      } else {
        i.state = ItemState.Indeterminate;
      }
    });
    if (viewOnly) {
      tmp = tmp.filter((i: any) => i.state !== ItemState.Uncheck);
      setOpen(tmp.map((i: any) => i.value));
    }
    setData(tmp);
  }, [value]);
  return (
    <div className="p-2 border rounded-md">
      {data.map((i: any, parentIndex: number) => (
        <div className="mt-2" key={i.value}>
          <Icon
            name={open.includes(i.value) ? "angle down" : "angle right"}
            className="cursor-pointer"
            onClick={() => {
              let tmp = [...open];
              if (tmp.includes(i.value)) {
                tmp = tmp.filter((o: string) => o !== i.value);
              } else {
                tmp.push(i.value);
              }
              setOpen(tmp);
            }}
          />
          <Checkbox
            disabled={viewOnly}
            indeterminate={i.state === ItemState.Indeterminate}
            checked={i.state === ItemState.Check}
            label={i.label}
            onChange={(evt: any, { checked }) => {
              let newValue = i.children.map((c: any) => c.value);
              let tmp = _.difference(value, newValue);
              if (checked) {
                tmp = tmp.concat(newValue);
              }
              onChange(tmp);
            }}
          />
          {open.includes(i.value) && (
            <div className="ml-12">
              {i.children &&
                i.children.length > 0 &&
                i.children.map((c: any, childIndex: number) => (
                  <div key={c.value}>
                    <Checkbox
                      disabled={viewOnly}
                      onChange={(evt: any, { checked }) => {
                        let tmp = [...value];
                        if (checked) {
                          tmp.push(c.value);
                        } else {
                          tmp = tmp.filter((v) => v !== c.value);
                        }
                        onChange(tmp);
                      }}
                      label={c.label}
                      indeterminate={c.state === ItemState.Indeterminate}
                      checked={c.state === ItemState.Check}
                    />
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
