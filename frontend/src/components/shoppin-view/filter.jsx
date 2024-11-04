import { filterOptions } from "@/config";
import React, { Fragment } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";

const ProductFilter = ({ filters, handleFilter }) => {
  return (
    <div className="bg-background rounded-xl shadow-lg">
      <div className="p-4 border-b">
        <h2 className="text-lg font-extrabold">Filters</h2>
      </div>
      <div className="p-4 space-y-4">
        {Object.keys(filterOptions).map((item) => (
          <Fragment key={item}>
            <h2 className="text-base font-bold">{item}</h2>
            <div className="grid gap-2 mt-2">
              {filterOptions[item].map((option) => (
                <Label
                  key={option.id}
                  className="flex items-center gap-2 font-medium"
                >
                  <Checkbox
                    checked={
                      filters &&
                      Object.keys(filters).length > 0 &&
                      filters[item] &&
                      filters[item].indexOf(option.id) > -1
                    }
                    onCheckedChange={() => handleFilter(item, option.id)}
                  />
                  {option.label}
                </Label>
              ))}
            </div>
            <Separator />
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ProductFilter;
