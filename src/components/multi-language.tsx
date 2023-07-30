import { Button, Form, Header, List, TextArea } from "semantic-ui-react";
import { data } from "services";
import Enum from "./enum";

export default function MultiLanguage({
  value,
  onChange,
  viewOnly,
}: {
  viewOnly?: boolean;
  value: object[];
  onChange: Function;
}) {
  function handleChange(index: number, name: string, val: any) {
    let tmp: any = [...value];
    //@ts-ignore
    tmp[index][name] = val;
    onChange(tmp);
  }
  function addLanguage() {
    let tmp: any = [...value];
    tmp.push({});
    onChange(tmp);
  }
  function removeLanguage(index: number) {
    let tmp: any = [...value];
    tmp.splice(index, 1);
    onChange(tmp);
  }
  return (
    <div>
      <List divided>
        {value.map((i: any, index: number) => (
          <List.Item>
            <List.Content>
              <Form>
                <div
                  key={index}
                  className="flex w-full p-1 justify-between gap-2 flex-col"
                >
                  <div className="flex gap-2">
                    <div className="w-56">
                      <Enum
                        placeholder="Locale"
                        enumName="locales"
                        value={i.locale}
                        onChange={(val) => {
                          handleChange(index, "locale", val);
                        }}
                      />
                    </div>
                    {!viewOnly && (
                      <Button
                        icon="times"
                        color="red"
                        onClick={() => {
                          removeLanguage(index);
                        }}
                      />
                    )}
                  </div>
                  <TextArea
                    placeholder="Content"
                    value={i.content}
                    onChange={(evt) => {
                      // @ts-ignore
                      handleChange(index, "content", evt.target.value);
                    }}
                  />
                </div>
              </Form>
            </List.Content>
          </List.Item>
        ))}
      </List>

      <div className="mt-2">
        {!viewOnly && (
          <Button
            icon="plus"
            content="Add more language"
            labelPosition="left"
            onClick={addLanguage}
          />
        )}
      </div>
    </div>
  );
}
