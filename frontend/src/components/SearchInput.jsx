import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, onSearch }) => {
  return (
    <Field className="sm:w-full md:max-w-2xs lg:absolute lg:left-1/2 lg:-translate-x-1/2">
      <ButtonGroup>
        <Input
          id="input-button-group"
          placeholder="Type to search..."
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
          }}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
        />
        <Button variant="outline" className="border-muted" onClick={onSearch}>
          <Search />
        </Button>
      </ButtonGroup>
    </Field>
  );
};

export default SearchInput;
