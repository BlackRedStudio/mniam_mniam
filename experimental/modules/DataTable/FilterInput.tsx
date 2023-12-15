import { Input } from "@/components/ui/Input";
import { Table } from "@tanstack/react-table";

type TFilterInputProps = {
    table: Table<any>;
    id: string;
    placeholder: string;
};

function FilterInput({ table, id, placeholder }: TFilterInputProps) {
    return (
        <Input
            placeholder={placeholder}
            value={(table.getColumn(id)?.getFilterValue() as string) ?? ''}
            onChange={event =>
                table.getColumn(id)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
        />
    );
}

export default FilterInput;
