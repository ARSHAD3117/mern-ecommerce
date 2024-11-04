import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const CommonForm = ({
  formConrols,
  formData,
  setFormData,
  onSubmit,
  buttonText,
  isButtonDisabled,
}) => {
  const renderInputByComponentType = (item) => {
    let element = null;
    const value = formData[item?.name] || "";
    switch (item.componentType) {
      case "input":
        element = (
          <Input
            name={item.name}
            placeholder={item.placeholder}
            id={item.name}
            type={item.type}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [item.name]: event.target.value })
            }
          />
        );
        break;
      case "select":
        element = (
          <Select
            value={value}
            onValueChange={(value) =>
              setFormData({ ...formData, [item.name]: value })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={item.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {item.options && item.options.length > 0
                ? item.options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.label}
                    </SelectItem>
                  ))
                : null}
            </SelectContent>
          </Select>
        );
        break;
      case "textarea":
        element = (
          <Textarea
            name={item.name}
            placeholder={item.placeholder}
            id={item.id}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [item.name]: event.target.value })
            }
          />
        );
        break;

      default:
        element = (
          <Input
            name={item.name}
            placeholder={item.placeholder}
            id={item.name}
            type={item.type}
            value={value}
            onChange={(event) =>
              setFormData({ ...formData, [item.name]: event.target.value })
            }
          />
        );
        break;
    }
    return element;
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="flex flex-col gap-3">
        {formConrols.map((item, index) => {
          return (
            <div className="grid w-full gap-1.5" key={index}>
              <Label className="mb-1">{item.label}</Label>
              {renderInputByComponentType(item)}
            </div>
          );
        })}
      </div>
      <Button
        disabled={isButtonDisabled || false}
        type="submit"
        className="mt-2 w-full"
      >
        {buttonText || "Submit"}
      </Button>
    </form>
  );
};

export default CommonForm;
