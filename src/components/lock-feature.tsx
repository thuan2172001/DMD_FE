import { Feature, FeatureAffect } from "interfaces";
import _ from "lodash";
import { useMemo } from "react";
import { Button, Select } from "semantic-ui-react";

export default function LockFeature({
  value,
  onChange,
}: {
  value: any;
  onChange: Function;
}) {
  const featureOptions = useMemo(() => {
    let options = [];
    for (var i in Feature) {
      if (!isNaN(Number(i))) {
        options.push({ text: Feature[i], value: Number(i) });
      }
    }
    return options;
  }, []);
  const affectptions = useMemo(() => {
    let options = [];
    for (var i in FeatureAffect) {
      if (!isNaN(Number(i))) {
        options.push({ text: FeatureAffect[i], value: Number(i) });
      }
    }
    return options;
  }, []);
  return (
    <div>
      {value.map((f: [Feature, FeatureAffect], index: number) => {
        return (
          <div className="flex gap-2 mt-2">
            <Select
              placeholder={"Select feature"}
              fluid
              value={f[0]}
              options={featureOptions}
              onChange={(evt: any, val: any) => {
                let tmp = _.cloneDeep(value);
                tmp[index][0] = Number(val.value);
                onChange(tmp);
              }}
            />
            <Select
              placeholder={"Select affect"}
              fluid
              value={f[1]}
              options={affectptions}
              onChange={(evt: any, val: any) => {
                let tmp = _.cloneDeep(value);
                tmp[index][1] = Number(val.value);
                onChange(tmp);
              }}
            />
            <Button
              color="red"
              icon="close"
              onClick={() => {
                let tmp = _.cloneDeep(value);
                tmp.splice(index, 1);
                onChange(tmp);
              }}
            />
          </div>
        );
      })}
      <div className="mt-2">
        <Button
          icon="plus"
          content="Add Feature Lock"
          labelPosition="left"
          onClick={() => {
            let tmp = _.cloneDeep(value);
            tmp.push([]);
            onChange(tmp);
          }}
        />
      </div>
    </div>
  );
}
